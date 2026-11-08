import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

export async function initDb() {
  if (!db) {
    db = await Database.load("sqlite:app.db");
    console.log("DB initialized");
  }
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}