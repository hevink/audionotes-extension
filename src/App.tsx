import { useEffect, useState } from "react";
import HomePage from "./components/extension/Home";
import { useIsAuthenticated } from "./lib/auth";
import { useGetUserPlan } from "./queries";

const App = () => {
  const isAuthenticated: any = useIsAuthenticated();
  const { data: userPlan } = useGetUserPlan() as any;
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(
    sessionStorage.getItem("isFirstTimeLogin")
  );

  useEffect(() => {
    if (isAuthenticated) {
      const isProUser = userPlan?.plan === "pro";
      const firstTimeLoginValue = isProUser ? "false" : "true";
      sessionStorage.setItem("isFirstTimeLogin", firstTimeLoginValue);
      setIsFirstTimeLogin(firstTimeLoginValue);
    }
  }, [isAuthenticated, userPlan?.plan]);

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      console.log("stream", stream);
    })
    .catch((err) => {
      console.log("error", err);
      alert("Please grant microphone access in your browser settings.");
    });

  return (
    <div className="w-96 h-[546px]">
      <HomePage
        isAuthentications={isAuthenticated}
        isFirstTimeLogin={isFirstTimeLogin}
      />
    </div>
  );
};

export default App;
