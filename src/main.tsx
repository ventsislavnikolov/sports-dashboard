import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="bg-bg-primary text-accent-blue p-4 text-lg font-bold">
      CIRIOLAJI
    </div>
  </StrictMode>
);
