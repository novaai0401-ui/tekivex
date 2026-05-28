import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { initPageviewTracking } from './analytics/pageview';
import './styles.css';

initPageviewTracking();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
