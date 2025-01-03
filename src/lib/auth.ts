// src/lib/auth.ts
import supabase from "../lib/supabase/client";
import { useState, useEffect } from "react";

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

export const handleAuthorization = async (): Promise<boolean> => {
  try {
    const [token0, token1] = await Promise.all(COOKIE_NAMES.map(getCookie));

    if (!token0 || !token1) {
      return false;
    }

    const base64Token = (token0?.split("base64-")[1] || "") + token1;
    const session = JSON.parse(atob(base64Token));

    const { data, error } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (error) {
      console.error("Failed to set session:", error.message);
      return false;
    }

    console.log("Session set successfully:", data);

    // Fetch current user
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Failed to fetch user:", userError.message);
      return false;
    } else {
      console.log("Current User:", user);
      return true;
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
    return false;
  }
};

export const useIsAuthenticated = (): boolean | null => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await handleAuthorization();
      setIsAuthenticated(authStatus);
    };

    checkAuth();
  }, []);

  return isAuthenticated;
};
