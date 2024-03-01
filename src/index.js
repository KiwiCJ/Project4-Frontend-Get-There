import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'
import './interceptors/axios'
import { TripsProvider } from './context/TripContext';
import { CurrencyProvider } from './context/CurrencyContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CurrencyProvider>
    <TripsProvider>
      <App />
    </TripsProvider>
    </CurrencyProvider>
  </React.StrictMode>
);


