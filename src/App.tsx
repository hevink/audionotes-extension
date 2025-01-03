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

  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    console.log("stream", stream);
  }).catch((err) => {
    console.log("error", err);
    alert("Please grant microphone access in your browser settings.");
  });

  return (
    <div className="w-96 h-[546px]">
      <HomePage isAuthentications={isAuthenticated} />
    </div>
  );
};

export default App;
