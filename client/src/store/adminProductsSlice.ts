import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api, ApiError } from '../lib/api';
import type { Product } from './productSlice';

export interface CreateProductInput {
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}

export interface UpdateProductInput {
  id: string;
  data: Partial<CreateProductInput>;
}

export interface AdminProductsState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  actionStatus: 'idle' | 'submitting' | 'succeeded' | 'failed';
  error: string | null;
  successMessage: string | null;
}

const initialState: AdminProductsState = {
  products: [],
  status: 'idle',
  actionStatus: 'idle',
  error: null,
  successMessage: null,
};

// GET /products
export const fetchAllAdminProducts = createAsyncThunk(
  'adminProducts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<{ success: boolean; count: number; products: Product[] }>('/products');
      return response.products;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch admin products');
    }
  }
);

// POST /products (Admin only)
export const createAdminProduct = createAsyncThunk(
  'adminProducts/create',
  async (productData: CreateProductInput, { rejectWithValue }) => {
    try {
      const response = await api.post<{ success: boolean; message: string; product: Product }>(
        '/products',
        productData
      );
      return response.product;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create product');
    }
  }
);

// PATCH /products/:id (Admin only)
export const updateAdminProduct = createAsyncThunk(
  'adminProducts/update',
  async ({ id, data }: UpdateProductInput, { rejectWithValue }) => {
    try {
      const response = await api.patch<{ success: boolean; message: string; product: Product }>(
        `/products/${id}`,
        data
      );
      return response.product;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update product');
    }
  }
);

// DELETE /products/:id (Admin only)
export const deleteAdminProduct = createAsyncThunk(
  'adminProducts/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete<{ success: boolean; message: string }>(`/products/${id}`);
      return id;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete product');
    }
  }
);

const adminProductsSlice = createSlice({
  name: 'adminProducts',
  initialState,
  reducers: {
    clearAdminStatus: (state) => {
      state.error = null;
      state.successMessage = null;
      state.actionStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllAdminProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllAdminProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchAllAdminProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to load products';
      })
      // Create
      .addCase(createAdminProduct.pending, (state) => {
        state.actionStatus = 'submitting';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAdminProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.actionStatus = 'succeeded';
        state.products.unshift(action.payload);
        state.successMessage = `Product "${action.payload.name}" created successfully.`;
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = (action.payload as string) || 'Failed to create product';
      })
      // Update
      .addCase(updateAdminProduct.pending, (state) => {
        state.actionStatus = 'submitting';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.actionStatus = 'succeeded';
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.successMessage = `Product "${action.payload.name}" updated successfully.`;
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = (action.payload as string) || 'Failed to update product';
      })
      // Delete
      .addCase(deleteAdminProduct.pending, (state) => {
        state.actionStatus = 'submitting';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionStatus = 'succeeded';
        state.products = state.products.filter((p) => p._id !== action.payload);
        state.successMessage = 'Product deleted successfully.';
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = (action.payload as string) || 'Failed to delete product';
      });
  },
});

export const { clearAdminStatus } = adminProductsSlice.actions;
export default adminProductsSlice.reducer;
