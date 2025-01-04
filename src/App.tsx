import { useEffect, useState } from "react";
import HomePage from "./components/extension/Home";
import { useIsAuthenticated } from "./lib/auth";
import { useGetUserPlan } from "./queries";

const App = () => {
  const isAuthenticated: any = useIsAuthenticated();
  const { data: userPlan } = useGetUserPlan() as any;
  // const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(
  //   sessionStorage.getItem("isFirstTimeLogin")
  // );

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     const isProUser = userPlan?.plan === "pro";
  //     const firstTimeLoginValue = isProUser ? "false" : "true";
  //     sessionStorage.setItem("isFirstTimeLogin", firstTimeLoginValue);
  //     setIsFirstTimeLogin(firstTimeLoginValue);
  //   }
  // }, [isAuthenticated, userPlan?.plan]);

  // Initialize `isFirstTimeLogin` based on session and user plan
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(() => {
    const sessionValue = sessionStorage.getItem("isFirstTimeLogin");
    if (sessionValue !== null) return sessionValue; // Use stored value if available
    return isAuthenticated && userPlan?.plan !== "pro" ? "true" : "false";
  });

  useEffect(() => {
    if (isAuthenticated && userPlan?.plan !== "pro") {
      sessionStorage.setItem("isFirstTimeLogin", "true");
    } else {
      sessionStorage.setItem("isFirstTimeLogin", "false");
    }
  }, [isAuthenticated, userPlan?.plan]);

  // navigator.mediaDevices
  //   .getUserMedia({ audio: true })
  //   .then((stream) => {
  //     console.log("stream", stream);
  //   })
  //   .catch((err) => {
  //     console.log("error", err);
  //     alert("Please grant microphone access in your browser settings.");
  //   });

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
