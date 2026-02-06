import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider
import store from './store'; // Import Store
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

import axios from 'axios';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

axios.defaults.baseURL = 'http://localhost:5000'; // Your Backend Port
axios.defaults.withCredentials = true; // THIS IS THE KEY LINE
const initialOptions = {
  "client-id": "AaCGRVn9SeQcTNFoC2O1L8d-d4eLqN0OZQW-_fFXAySaQx5qwNYAC7y6LxxCv2tFrvOJ9PS_nJ9C5KvU",
  currency: "USD",
  intent: "capture",
};



const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    {/* Wrap everything in the Provider */}
    <Provider store={store}>
      <BrowserRouter>
        <PayPalScriptProvider options={initialOptions}>
          <App />
        </PayPalScriptProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);