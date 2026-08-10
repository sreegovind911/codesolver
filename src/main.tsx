import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Automatically route relative /api requests to the live Cloud Run backend when running on packaged Android assets
const originalFetch = window.fetch;
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

      if (url.startsWith('/api/')) {
        const isLocalMobile =
          window.location.protocol === 'capacitor:' ||
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1';

        if (isLocalMobile) {
          const remoteServerUrl = 'https://ais-dev-a5biqcpfrkbmyoi5mytwok-81507452437.asia-east1.run.app';
          url = remoteServerUrl + url;
        }
      }

      if (typeof input === 'string') {
        return originalFetch(url, init);
      } else if (input instanceof URL) {
        return originalFetch(new URL(url), init);
      } else {
        const newRequest = new Request(url, input);
        return originalFetch(newRequest, init);
      }
    }
  });
} catch (e) {
  console.warn('Unable to redefine window.fetch via Object.defineProperty, falling back to prototype override:', e);
  try {
    // If defining on window itself fails, try Window.prototype
    Object.defineProperty(Window.prototype, 'fetch', {
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

        if (url.startsWith('/api/')) {
          const isLocalMobile =
            window.location.protocol === 'capacitor:' ||
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';

          if (isLocalMobile) {
            const remoteServerUrl = 'https://ais-dev-a5biqcpfrkbmyoi5mytwok-81507452437.asia-east1.run.app';
            url = remoteServerUrl + url;
          }
        }

        if (typeof input === 'string') {
          return originalFetch(url, init);
        } else if (input instanceof URL) {
          return originalFetch(new URL(url), init);
        } else {
          const newRequest = new Request(url, input);
          return originalFetch(newRequest, init);
        }
      }
    });
  } catch (err) {
    console.error('Failed to monkeypatch fetch completely:', err);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

