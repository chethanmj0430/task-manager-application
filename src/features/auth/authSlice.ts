import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null; 
}

const initialState: AuthState = {
  token: localStorage.getItem('jwt_token') || null,
  isAuthenticated: !!localStorage.getItem('jwt_token'),
  loading: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Ensure errorData.message is treated as string
        return rejectWithValue(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('jwt_token', data.token);
      return data.token as string;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Network error or server unavailable');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('jwt_token');
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = 'pending';
        state.error = null; 
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = 'succeeded';
        state.token = action.payload;
        state.isAuthenticated = true;
        state.error = null; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;