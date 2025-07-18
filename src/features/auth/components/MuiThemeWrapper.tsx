import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../app/store';

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  type PaletteMode,
  CssBaseline 
} from '@mui/material';
import { amber, deepOrange, grey } from '@mui/material/colors';
import { type Theme, type Components } from '@mui/material/styles';

interface MuiThemeWrapperProps {
  children: React.ReactNode;
}

const MuiThemeWrapper: React.FC<MuiThemeWrapperProps> = ({ children }) => {
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  const getDesignTokens = (mode: PaletteMode) => {
    const components: Components<Theme> = {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    };

    return {
      palette: {
        mode,
        ...(mode === 'light'
          ? {
              primary: {
                main: amber[800],
              },
              secondary: {
                  main: deepOrange[500],
              },
              background: {
                default: grey[100],
                paper: grey[50],
              },
              text: {
                primary: grey[900],
                secondary: grey[800],
              },
            }
          : {
              primary: {
                main: amber[300],
              },
              secondary: {
                  main: deepOrange[300],
              },
              background: {
                default: grey[900], 
                paper: grey[800],
              },
              text: {
                primary: '#fff',
                secondary: grey[500],
              },
            }),
      },
      typography: {
          fontFamily: [
              '-apple-system',
              'BlinkMacSystemFont',
              '"Segoe UI"',
              'Roboto',
              '"Helvetica Neue"',
              'Arial',
              'sans-serif',
              '"Apple Color Emoji"',
              '"Segoe UI Emoji"',
              '"Segoe UI Symbol"',
          ].join(','),
      },
      components: components,
    };
  };

  const theme = useMemo(() => createTheme(getDesignTokens(themeMode)), [themeMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline /> {}
      {children}
    </MuiThemeProvider>
  );
};

export default MuiThemeWrapper;