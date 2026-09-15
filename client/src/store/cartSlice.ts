import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api, ApiError } from '../lib/api';

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  itemTotal: number;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  items: CartItem[];
  total: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  status: 'idle',
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<CartResponse>('/cart');
      return { items: response.items, total: response.total };
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (payload: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.post<CartResponse>('/cart', payload);
      return { items: response.items, total: response.total };
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (payload: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.patch<CartResponse>(`/cart/${payload.productId}`, {
        quantity: payload.quantity,
      });
      return { items: response.items, total: response.total };
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<CartResponse>(`/cart/${productId}`);
      return { items: response.items, total: response.total };
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to remove item from cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.total = 0;
      state.status = 'idle';
      state.error = null;
    },
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<{ items: CartItem[]; total: number }>) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to load cart';
      })
      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<{ items: CartItem[]; total: number }>) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to add to cart';
      })
      // updateCartItem
      .addCase(updateCartItem.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<{ items: CartItem[]; total: number }>) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to update cart';
      })
      // removeFromCart
      .addCase(removeFromCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<{ items: CartItem[]; total: number }>) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to remove from cart';
      });
  },
});

export const { clearCartState, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
