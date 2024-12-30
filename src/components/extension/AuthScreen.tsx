import React from "react";
import { Button } from "../ui/button";

const AuthScreen = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col justify-center items-center p-10">
        <p className="text-foreground font-bold text-lg text-center">
          You are are not Logged In
        </p>

        <p className="text-active text-sm font-medium text-center">
          Please Signup/Login to Audionotes.app to continue using the chrome
          extension
        </p>
      </div>

      <div className="space-y-2 px-6 pt-8">
        <Button
          size={"lg"}
          className="flex items-center font-medium text-base leading-5 w-full bg-gradient-to-r from-[#FF4D00] to-[#FF2600] text-white"
          variant={"primary"}
        >
          Signup for Free
        </Button>

        <p className="font-medium text-sm text-center">
          Already Registered?
          <span className="text-primary"> Login</span>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
