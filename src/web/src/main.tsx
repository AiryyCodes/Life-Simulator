import "@/bootstrap";

import "@lib/services";

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ServiceManager } from "@shared/service/service.ts";

ServiceManager.init();

createRoot(document.getElementById("root")!).render(<App />);
