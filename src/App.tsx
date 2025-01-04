import { useEffect, useState } from "react";
import HomePage from "./components/extension/Home";
import { useIsAuthenticated } from "./lib/auth";
import { useGetUserPlan } from "./queries";

interface UserPlan {
  plan: string;
}

const App: React.FC = () => {
  const isAuthenticated: boolean | null = useIsAuthenticated();
  const { data: userPlan } = useGetUserPlan() as { data: UserPlan | undefined };

  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState<
    string | null | boolean
  >(localStorage.getItem("isFirstTimeLogin"));

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
