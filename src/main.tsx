import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Model from "./store/Model.tsx";

createRoot(document.getElementById("root")!).render(
  <Model>
    <App />
  </Model>
);
