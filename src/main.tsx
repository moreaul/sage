import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { initDb } from "@/src/database/db";

async function bootstrap() {
  await initDb();

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <HeroUIProvider>
        <ToastProvider placement="bottom-right" />
        <App />
      </HeroUIProvider>
    </React.StrictMode>
  );
}

bootstrap().catch((e) => {
  console.error("Bootstrap failed:", e);
});
