import { useEffect, useState } from "react";
import HomePage from "./components/extension/Home";
import supabase from "./lib/supabase/client";

const COOKIE_NAMES = [
  "sb-rbpvjxsqghhirdixhaay-auth-token.0",
  "sb-rbpvjxsqghhirdixhaay-auth-token.1",
];
const COOKIE_URL = "https://home.audionotes.app/";

const getCookie = (name: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    chrome.cookies.get({ url: COOKIE_URL, name }, (cookie) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(cookie?.value || null);
      }
    });
  });
};

const handleAuthorization = async () => {
  try {
    const [token0, token1] = await Promise.all(COOKIE_NAMES.map(getCookie));

    if (!token0 || !token1) {
      chrome.tabs.create({
        url: "https://home.audionotes.app/login",
      });
      return;
    }

    const base64Token = (token0?.split("base64-")[1] || "") + token1;
    const session = JSON.parse(atob(base64Token));

    const { data, error } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (error) {
      console.error("Failed to set session:", error.message);
      return;
    }

    console.log("Session set successfully:", data);

    // Fetch current user
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Failed to fetch user:", userError.message);
    } else {
      console.log("Current User:", user);
    }
  } catch (err) {
    console.error("Authorization error:", err);
    chrome.runtime.sendMessage({
      msg: "ERROR",
      data: {
        subject: "Authorization Error",
        content: (err as Error).message,
      },
    });
  }
};

const App = () => {
  useEffect(() => {
    const getUserPermission = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Using navigator.mediaDevices.getUserMedia to request microphone access
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            // Permission granted, handle the stream if needed
            console.log("Microphone access granted");

            // Stop the tracks to prevent the recording indicator from being shown
            stream.getTracks().forEach((track) => track.stop());

            resolve();
          })
          .catch((error) => {
            console.error("Error requesting microphone permission", error);

            reject(error);
          });
      });
    };

    // Call the function to request microphone permission
    getUserPermission();

    handleAuthorization();
  }, []);

  // navigator.mediaDevices
  //   .getUserMedia({ audio: true })
  //   .then((stream) => {
  //     console.log("Microphone access granted");
  //     // Do something with the audio stream
  //     const audioTracks = stream.getAudioTracks();
  //     console.log("Audio tracks: ", audioTracks);
  //   })
  //   .catch((error) => {
  //     console.error("Microphone access denied", error);
  //   });

  // const { stream, error } = useMicrophone();

  return (
    <div className="w-96">
      {/* <h1>Microphone Access</h1>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : stream ? (
        <p>Microphone is active. Stream ID: {stream.id}</p>
      ) : (
        <p>Requesting microphone access...</p>
      )} */}
      <HomePage />
    </div>
  );
};

export default App;

const useMicrophone = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((audioStream) => {
        console.log("Microphone access granted");
        setStream(audioStream);
      })
      .catch((err) => {
        console.error("Microphone access denied", err);
        setError(err.message);
      });

    // Clean up the audio stream when the component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return { stream, error };
};
