import { useEffect } from "react";
import HomePage from "./components/extension/Home";
import { useIsAuthenticated } from "./lib/auth";

const App = () => {
  const isAuthenticated: any = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem("isFirstTimeLogin", "true");
    } else {
      sessionStorage.setItem("isFirstTimeLogin", "false");
    }
  }, [isAuthenticated]);

  return (
    <div className="w-96 h-[546px]">
      <HomePage isAuthentications={isAuthenticated} />
    </div>
  );
};

export default App;
