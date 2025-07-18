// src/features/ui/uiSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type PaletteMode } from '@mui/material';

interface UiState {
  themeMode: PaletteMode;
}

const getInitialThemeMode = (): PaletteMode => {
  return (localStorage.getItem('themeMode') as PaletteMode) || 'light';
};

const initialState: UiState = {
  themeMode: getInitialThemeMode(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', state.themeMode);
    },
    setThemeMode: (state, action: PayloadAction<PaletteMode>) => {
      state.themeMode = action.payload;
      localStorage.setItem('themeMode', state.themeMode);
    },
  },
});

export const { toggleThemeMode, setThemeMode } = uiSlice.actions;
export default uiSlice.reducer;