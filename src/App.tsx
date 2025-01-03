import HomePage from "./components/extension/Home";
import { useIsAuthenticated } from "./lib/auth";
import { Loader2 } from "lucide-react";

const App = () => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated === null) {
    return (
      <div>
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>Please log in to continue.</div>; // Display fallback for unauthenticated users
  }
  return (
    <div className="w-96">
      <HomePage />
    </div>
  );
};

export default App;
