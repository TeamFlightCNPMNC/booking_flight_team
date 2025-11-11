import React from "react";
import { HelmetProvider } from "react-helmet-async";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";

import { OrderProvider } from "./Context/ContextGlobal";
import { SocketProvider } from "./Context/SocketContext";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <SocketProvider>
            <OrderProvider>
              <App />
            </OrderProvider>
          </SocketProvider>
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  </QueryClientProvider>
);
