import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";

export const mount = (node: ReactNode) =>
  createRoot(document.getElementById("root")!).render(<StrictMode>{node}</StrictMode>);
