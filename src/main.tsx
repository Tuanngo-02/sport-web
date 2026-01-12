import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import Layout from './Layout.js'

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </StrictMode>
  );
} else {
  throw new Error('Root element not found');
}
