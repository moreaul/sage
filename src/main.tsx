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

function showFatalError(e: unknown) {
  const root = document.getElementById("root");
  // Seulement si rien n'est affiché (démarrage raté ou React a tout démonté) : une erreur
  // anodine pendant que l'app tourne ne doit pas remplacer l'écran.
  if (!root || root.childElementCount > 0) return;
  console.error("Fatal error:", e);
  const pre = document.createElement("pre");
  pre.style.cssText = "margin:16px;padding:16px;white-space:pre-wrap;color:#f87171;background:#1f1f1f;font:13px monospace";
  pre.textContent = `Erreur au démarrage :\n\n${e instanceof Error ? e.stack ?? e.message : String(e)}`;
  root.replaceChildren(pre);
}

// Différé : quand un rendu plante, React démonte l'arbre juste après avoir signalé l'erreur.
window.addEventListener("error", (ev) => setTimeout(() => showFatalError(ev.error ?? ev.message)));
window.addEventListener("unhandledrejection", (ev) => setTimeout(() => showFatalError(ev.reason)));

bootstrap().catch(showFatalError);
