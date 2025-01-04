import { useEffect, useState } from "react";
import HomePage from "./components/extension/Home";
import { useIsAuthenticated } from "./lib/auth";
import { useGetUserPlan } from "./queries";

const App = () => {
  const isAuthenticated: any = useIsAuthenticated();
  const { data: userPlan } = useGetUserPlan() as any;
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(
    localStorage.getItem("isFirstTimeLogin")
  );

  useEffect(() => {
    if (isAuthenticated) {
      const isProUser = userPlan?.plan === "pro";
      const firstTimeLoginValue = isProUser ? "false" : "true";
      localStorage.setItem("isFirstTimeLogin", firstTimeLoginValue);
      setIsFirstTimeLogin(firstTimeLoginValue);
    }
  }, [isAuthenticated, userPlan?.plan]);

  return (
    <div className="w-96 h-[546px]">
      <HomePage
        isAuthentications={isAuthenticated}
        isFirstTimeLogin={isFirstTimeLogin}
        setIsFirstTimeLogin={setIsFirstTimeLogin}
      />
    </div>
  );
};

export default App;
