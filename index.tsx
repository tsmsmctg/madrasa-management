import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Madrasa App: Initializing on mount point...");

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("CRITICAL ERROR: Root element '#root' not found in index.html!");
}
