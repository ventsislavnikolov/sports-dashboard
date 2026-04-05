import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <div className="bg-bg-primary text-accent-blue p-4 text-lg font-bold">
        CIRIOLAJI
      </div>
    </StrictMode>
  );
});
