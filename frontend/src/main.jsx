import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Buffer polyfill is handled at build time by vite-plugin-node-polyfills
// No manual polyfill needed here

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
