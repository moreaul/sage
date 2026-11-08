// import Home from "@/src/pages/home.tsx"
import NewApp from "@/src/pages/newapp.tsx";

function App() {

  // Le thème (classe light/dark) est appliqué sur <html> par src/theme.ts.
  return (
    <main className="h-screen w-full max-w-none min-h-screen bg-background text-foreground">
      {/*<Home></Home>*/}
      <NewApp></NewApp>
    </main>
  );

}

export default App;
