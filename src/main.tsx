import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { worker } from './api/browser';
import { Provider } from 'react-redux';
import { store } from './app/store';
import MuiThemeWrapper from './features/auth/components/MuiThemeWrapper.tsx';

async function enableMocking() {
  if (process.env.NODE_ENV === 'development') {
    return worker.start();
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Provider store={store}>
        <MuiThemeWrapper>
          <App />
        </MuiThemeWrapper>
      </Provider>
    </React.StrictMode>
  );
});