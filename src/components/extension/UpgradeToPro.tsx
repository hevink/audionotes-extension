import { Mic, X } from "lucide-react";
import { Button } from "../ui/button";
import RightArrowIcon from "../../assets/icons/RightArrowIcon";

interface UpgradeToProProps {
  setStartRecordings: (value: string) => void;
  handleStartRecording: () => void;
  setActiveTab: (value: string) => void;
  setUpgradeToProScreen: (value: string) => void;
  setUpgradePlan: (value: string) => void;
  setIsFirstTimeLogin: (value: string) => void;
}

const UpgradeToPro: React.FC<UpgradeToProProps> = ({
  setStartRecordings,
  handleStartRecording,
  setActiveTab,
  setUpgradeToProScreen,
  setUpgradePlan,
  setIsFirstTimeLogin,
}) => {
  const handleUpgradeToPro = () => {
    setUpgradeToProScreen("");
    setStartRecordings("startRecordings");
    handleStartRecording();
    setIsFirstTimeLogin("false");
    localStorage.setItem("isFirstTimeLogin", "false");
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        {/* Left Side: Mic Icon and Title */}
        <div className="flex items-center space-x-2">
          <div className="bg-primary p-2 rounded-lg">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-base font-semibold">
            Audionotes<span className="text-primary">.app</span>
          </h1>
        </div>

        {/* Right Side: Close Icon */}
        <div
          className="bg-plain rounded-full p-2 cursor-pointer"
          onClick={() => {
            setActiveTab("files");
            setUpgradeToProScreen("");
          }}
        >
          <X className="h-5 w-5 text-subheading" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-36">
        <div className="max-w-64 ">
          <p className="text-foreground font-bold text-lg leading-6 text-center">
            Unlock <span className="text-primary"> PRO </span> Benefits
          </p>
          <p className="font-medium text-sm text-active text-center">
            Want to record meeting minutes longer than 5 mins?{" "}
          </p>
          <Button
            variant="default"
            size="lg"
            className="font-medium text-base w-full mt-4 bg-gradient-to-tr from-[#FF4D00] to-[#FF2600]"
            onClick={() => setUpgradePlan("upgradePlan")}
          >
            Upgrade to PRO
          </Button>
        </div>
      </div>
      <Button
        variant="plain"
        size="lg"
        className="font-medium text-base w-full bg-[#F3F3F3] gap-1.5"
        onClick={() => {
          handleUpgradeToPro();
        }}
      >
        Continue to Start Recording <RightArrowIcon color="#454545" />
      </Button>
    </div>
  );
};

export default UpgradeToPro;
