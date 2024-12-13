import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import App from './App.tsx';
import './index.css';
import { scClient } from './ApolloClient.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={scClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
