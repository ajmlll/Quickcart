import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api, ApiError } from '../lib/api';

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductQueryParams {
  search?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  sort?: string;
  category?: string;
}

export interface ProductState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductQueryParams | undefined, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.search && params.search.trim() !== '') {
        searchParams.append('search', params.search.trim());
      }
      if (params?.sort) {
        searchParams.append('sort', params.sort);
      }
      if (params?.category) {
        searchParams.append('category', params.category);
      }
      if (params?.minPrice !== undefined && params.minPrice !== '') {
        searchParams.append('minPrice', String(params.minPrice));
      }
      if (params?.maxPrice !== undefined && params.maxPrice !== '') {
        searchParams.append('maxPrice', String(params.maxPrice));
      }

      const queryString = searchParams.toString();
      const endpoint = queryString ? `/products?${queryString}` : '/products';

      const response = await api.get<{ success: boolean; count: number; products: Product[] }>(endpoint);
      return response.products;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to load products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to fetch products';
      });
  },
});

export default productSlice.reducer;
