import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// If MercadoPago is configured, initialize
if (window.MercadoPago) {
  // MercadoPago will be initialized per-demand when needed
  console.log("MercadoPago SDK loaded");
}

createRoot(document.getElementById("root")!).render(<App />);
