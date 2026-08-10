import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Automatically route relative /api requests to the live Cloud Run backend when running on packaged Android assets
// Automatically route relative /api requests when running on packaged standalone mobile webview assets (capacitor:)
const originalFetch = window.fetch;

function resolveApiUrl(inputUrl: string): string {
  if (typeof inputUrl === 'string' && (inputUrl.startsWith('/api/') || inputUrl.startsWith('/'))) {
    // Only rewrite URL if running inside packaged Capacitor/file: mobile environment where window.location is not http/https
    if (window.location.protocol === 'capacitor:' || window.location.protocol === 'file:') {
      const remoteServerUrl = 'http://localhost:3000';
      return `${remoteServerUrl}${inputUrl.startsWith('/') ? '' : '/'}${inputUrl}`;
    }
  }
  return inputUrl;
}

try {
  Object.defineProperty(window, 'fetch', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function (input: any, init?: any): Promise<Response> {
      let url = '';
      if (typeof input === 'string') {
        url = input;
      } else if (input instanceof URL) {
        url = input.toString();
      } else if (input && typeof input.url === 'string') {
        url = input.url;
      }

      const finalUrl = resolveApiUrl(url);

      if (typeof input === 'string') {
        return originalFetch(finalUrl, init);
      } else if (input instanceof URL) {
        return originalFetch(new URL(finalUrl), init);
      } else {
        const newRequest = new Request(finalUrl, input);
        return originalFetch(newRequest, init);
      }
    },
  });
} catch (e) {
  console.warn('Fetch override warning:', e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

