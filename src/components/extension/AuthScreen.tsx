import { Button } from "../ui/button";

const AuthScreen = ({ isAuthentications }: any) => {
  return (
    <div className="">
      <div className="flex flex-col justify-center items-center space-y-2 max-w-[253px] mx-auto py-32">
        <p className="text-foreground font-bold text-lg text-center">
          You are are not Logged In
        </p>

        <p className="text-active text-sm font-medium text-center">
          Please Signup/Login to Audionotes.app to continue using the chrome
          extension
        </p>
      </div>

      <div className="space-y-3 px-8">
        <Button
          size={"lg"}
          className="flex items-center font-medium text-base leading-5 w-full bg-gradient-to-br from-[#FF4D00] to-[#FF2600] text-white"
          variant={"primary"}
          onClick={() =>
            !isAuthentications &&
            window.open("https://home.audionotes.app/", "_blank")
          }
        >
          Signup for Free
        </Button>

        <p className="font-medium text-sm text-center">
          Already Registered?
          <span
            onClick={() =>
              !isAuthentications &&
              window.open("https://home.audionotes.app/", "_blank")
            }
            className="text-primary cursor-pointer"
          >
            {" "}
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
