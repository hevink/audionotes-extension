// import { useEffect, useState } from "react";
import HomePage from "./components/extension/Home";
import GoogleAuth from "./GoogleAuth";

// Cookie names and URL
// const COOKIE_NAMES = [
//   "sb-rbpvjxsqghhirdixhaay-auth-token.0",
//   "sb-rbpvjxsqghhirdixhaay-auth-token.1",
// ];
// const COOKIE_URL = "https://home.audionotes.app/";

// const EXTENSION_URL = "https://home.audionotes.app/";

const App = () => {
  // /**
  //  * Sets a cookie in Chrome
  //  */
  // const setCookie = async (name: string, value: string): Promise<void> => {
  //   return new Promise((resolve, reject) => {
  //     chrome.cookies.set(
  //       {
  //         url: EXTENSION_URL,
  //         name,
  //         value,
  //         path: "/",
  //       },
  //       (cookie) => {
  //         if (chrome.runtime.lastError) {
  //           reject(chrome.runtime.lastError);
  //         } else {
  //           console.log(`Cookie "${name}" set successfully.`);
  //           resolve();
  //         }
  //       }
  //     );
  //   });
  // };

  // /**
  //  * Fetches cookies by names
  //  */
  // const getCookies = async (): Promise<(chrome.cookies.Cookie | null)[]> => {
  //   return Promise.all(
  //     COOKIE_NAMES.map(
  //       (name) =>
  //         new Promise<chrome.cookies.Cookie | null>((resolve, reject) => {
  //           chrome.cookies.get(
  //             {
  //               url: COOKIE_URL,
  //               name,
  //             },
  //             (cookie) => {
  //               if (chrome.runtime.lastError) {
  //                 reject(chrome.runtime.lastError);
  //               } else {
  //                 resolve(cookie);
  //               }
  //             }
  //           );
  //         })
  //     )
  //   );
  // };

  // /**
  //  * Checks and sets cookies if available
  //  */
  // const checkAndSetCookies = async () => {
  //   try {
  //     const cookies = await getCookies();

  //     // Always attempt to set cookies, even if they exist in the browser context
  //     if (cookies.some((cookie) => cookie?.value)) {
  //       console.log("Setting cookies...");
  //       await Promise.all(
  //         cookies.map((cookie, index) =>
  //           cookie?.value
  //             ? setCookie(COOKIE_NAMES[index], cookie.value)
  //             : Promise.resolve()
  //         )
  //       );
  //       console.log("Cookies set successfully.");
  //     }

  //     return {
  //       hasAllCookies: cookies.every((cookie) => cookie?.value),
  //       cookies,
  //     };
  //   } catch (error) {
  //     console.error("Error checking cookies:", error);
  //     return {
  //       hasAllCookies: false,
  //       cookies: [],
  //     };
  //   }
  // };

  // /**
  //  * Handles the authorization logic
  //  */
  // const handleAuthorization = async () => {
  //   try {
  //     const { hasAllCookies, cookies } = await checkAndSetCookies();

  //     if (!hasAllCookies) {
  //       console.warn("Missing one or both cookies. Redirecting to login.");
  //       chrome.tabs.create({
  //         url: `${COOKIE_URL}login`,
  //       });
  //     } else {
  //       console.log("All cookies exist", {
  //         token0: cookies[0],
  //         token1: cookies[1],
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Authorization error:", err);
  //     chrome.runtime.sendMessage({
  //       msg: "ERROR",
  //       data: {
  //         subject: "error",
  //         content: "Authorization error",
  //       },
  //     });
  //   }
  // };

  // useEffect(() => {
  //   handleAuthorization();
  // }, []);

  return (
    <div className="w-96">
      <HomePage />
    </div>
  );
};

export default App;
