import React from "react";
import ReactDOM from "react-dom/client";

import App from "@/app/App";
import { AppProviders } from "@/providers/app-providers";

import "@/styles/global.css";

async function enableMocking() {
  // Enable MSW in both development and production for demo purposes
  if (import.meta.env.DEV || import.meta.env.PROD) {
    const { worker } = await import("@/mocks/browser");
    await worker.start({ 
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js"
      }
    });
    // Mark MSW as available for fallback detection
    (window as any).__MSW_AVAILABLE__ = true;
  }
}

async function bootstrap() {
  await enableMocking();

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element with id 'root' was not found.");
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </React.StrictMode>
  );
}

bootstrap();
