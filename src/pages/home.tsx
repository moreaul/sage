import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import MyTabs from "@/src/components/Tabs.tsx";

export default function Home() {

  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <>
      <MyTabs></MyTabs>
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">HeroUI + Tailwind v4 + Tauri 🚀</h1>
        <button className="btn-primary">Bouton HeroUI (si tu en utilises)</button>
        <div className="bg-red-500 text-white p-3 rounded-lg">
          Si ce bloc est rouge → Tailwind OK ✅
        </div>
      </div>
      <div className="bg-default border border-divider rounded-md p-3">
        Bloc comme dans ton UI Sage
      </div>
      <h1>Home</h1>
      <h2>Welcome to Tauri + React</h2>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
    </>
  )
}