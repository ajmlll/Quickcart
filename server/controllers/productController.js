import mongoose from 'mongoose';
import { z } from 'zod';
import Product from '../models/Product.js';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().gt(0, 'Price must be greater than 0'),
  stock: z.number().gte(0, 'Stock must be non-negative').default(0),
  image: z.string().optional().default(''),
});

export const updateProductSchema = createProductSchema.partial();

/**
 * @desc    Get all products (supports search, minPrice, maxPrice, sort)
 * @route   GET /products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const { search, minPrice, maxPrice, sort, category } = req.query;

    const query = {};

    // Search filter: case-insensitive partial match on name
    if (search && typeof search === 'string' && search.trim() !== '') {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    // Category filter
    if (category && typeof category === 'string' && category.trim() !== '') {
      query.category = category.trim();
    }

    // Price filtering (minPrice / maxPrice)
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        const min = Number(minPrice);
        if (!isNaN(min)) query.price.$gte = min;
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        const max = Number(maxPrice);
        if (!isNaN(max)) query.price.$lte = max;
      }
    }

    // Sorting: price_asc, price_desc, etc.
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'name_asc') {
      sortOption = { name: 1 };
    } else if (sort === 'name_desc') {
      sortOption = { name: -1 };
    }

    const products = await Product.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /products
 * @access  Private / Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const validationResult = createProductSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const product = await Product.create(validationResult.data);

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product by ID
 * @route   PATCH /products/:id
 * @access  Private / Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const validationResult = updateProductSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: validationResult.data },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product by ID
 * @route   DELETE /products/:id
 * @access  Private / Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all distinct product categories stored in DB
 * @route   GET /products/categories
 * @access  Public
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    const cleanCategories = categories
      .filter((cat) => typeof cat === 'string' && cat.trim() !== '')
      .map((cat) => cat.trim());
    
    // De-duplicate and sort alphabetically
    const uniqueCategories = Array.from(new Set(cleanCategories)).sort();

    return res.status(200).json({
      success: true,
      count: uniqueCategories.length,
      categories: uniqueCategories,
    });
  } catch (error) {
    next(error);
  }
};

