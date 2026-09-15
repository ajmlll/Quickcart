import mongoose from 'mongoose';
import { z } from 'zod';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * Helper to compute line totals & total cart price SERVER-SIDE at request time.
 * Calculates (product.price * quantity) dynamically without trusting stored/cached totals.
 */
const calculateCartTotals = (cart) => {
  let total = 0;
  const items = [];

  if (cart && cart.items) {
    for (const item of cart.items) {
      if (item.product && typeof item.product === 'object' && item.product.price !== undefined) {
        const itemTotal = Number((item.product.price * item.quantity).toFixed(2));
        total += itemTotal;
        items.push({
          product: item.product,
          quantity: item.quantity,
          itemTotal,
        });
      }
    }
  }

  total = Number(total.toFixed(2));
  return { items, total };
};

const addToCartSchema = z.object({
  productId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid product ID format',
  }),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .gt(0, 'Quantity must be a positive integer greater than 0'),
});

const updateCartItemSchema = z.object({
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .gt(0, 'Quantity must be a positive integer greater than 0'),
});

/**
 * @desc    Get current user's cart with populated products and server-calculated totals
 * @route   GET /cart
 * @access  Private
 */
export const getCart = async (req, res, next) => {
  try {
    // OWNERSHIP-ISOLATION GUARANTEE:
    // Query is strictly scoped by { user: req.user._id } to guarantee users can only fetch their own cart.
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const { items, total } = calculateCartTotals(cart);

    return res.status(200).json({
      success: true,
      items,
      total,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add product to current user's cart or increase quantity
 * @route   POST /cart
 * @access  Private
 */
export const addToCart = async (req, res, next) => {
  try {
    const validationResult = addToCartSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const { productId, quantity } = validationResult.data;

    // Check if product exists in database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // OWNERSHIP-ISOLATION GUARANTEE:
    // Query is strictly scoped by { user: req.user._id } to guarantee cart items are added exclusively to the authenticated user's cart.
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Find if line item already exists
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    let newQuantity = quantity;
    if (existingItemIndex > -1) {
      newQuantity = cart.items[existingItemIndex].quantity + quantity;
    }

    // Stock check
    if (newQuantity > product.stock) {
      return res.status(409).json({
        success: false,
        message: `Only ${product.stock} in stock`,
      });
    }

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');

    const { items, total } = calculateCartTotals(cart);

    return res.status(200).json({
      success: true,
      message: 'Item added to cart',
      items,
      total,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update quantity of a product line in current user's cart
 * @route   PATCH /cart/:productId
 * @access  Private
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const validationResult = updateCartItemSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const { quantity } = validationResult.data;

    // Check if product exists in database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // OWNERSHIP-ISOLATION GUARANTEE:
    // Query is strictly scoped by { user: req.user._id } to guarantee updates apply strictly to the authenticated user's cart.
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in user cart',
      });
    }

    // Stock check
    if (quantity > product.stock) {
      return res.status(409).json({
        success: false,
        message: `Only ${product.stock} in stock`,
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    const { items, total } = calculateCartTotals(cart);

    return res.status(200).json({
      success: true,
      message: 'Cart item updated',
      items,
      total,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove product line from current user's cart
 * @route   DELETE /cart/:productId
 * @access  Private
 */
export const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    // OWNERSHIP-ISOLATION GUARANTEE:
    // Query is strictly scoped by { user: req.user._id } to guarantee deletions apply strictly to the authenticated user's cart.
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in user cart',
      });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate('items.product');

    const { items, total } = calculateCartTotals(cart);

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      items,
      total,
    });
  } catch (error) {
    next(error);
  }
};
