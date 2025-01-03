import { useState, useEffect } from "react";
import InputLanguageIcon from "../../assets/icons/InputLanguageIcon";
import HeadphoneIcon from "../../assets/icons/HeadphoneIcon";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import RecordIcon from "../../assets/icons/RecordIcon";
import AudioDropdown from "./AudioDropdown";
import { useGetUserPlan } from "../../queries";
import { PrimaryArrowIcon } from "../../assets/icons/LeftArrowIcon";

const RecentAudio = ({
  handleSubmit,
  setShowLanguagesData,
  setStartRecordings,
  handleStartRecording,
  isAuthentications,
  setUpgradeToProScreen,
  isLogin,
}: any) => {
  const { data: userPlan } = useGetUserPlan() as any;

  const [selectedAudioDevice, setSelectedAudioDevice] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [audioDevices, setAudioDevices] = useState<any>([]);

  useEffect(() => {
    const fetchAudioDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(
        (device) => device.kind === "audioinput"
      );
      setAudioDevices(audioInputs);
    };

    fetchAudioDevices();
  }, []);

  // Function to clean device label by removing text in parentheses
  const cleanDeviceLabel = (label: string) => {
    return label.replace(/\s*\([^)]*\)/g, "").trim();
  };

  const toggleDropdown = (e: any) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <form onSubmit={handleSubmit} className="text-center mb-4 px-4">
      <p className="text-sm text-active font-medium mb-2 mt-9">
        To record zoom/google meet call click on include system audio
      </p>
      <div className="space-y-2">
        <div
          onClick={() => setShowLanguagesData("setShowLanguagesData")}
          className="flex justify-between gap-2 items-center px-6 py-3 rounded-full bg-gray-50 border border-gray-200 bg-[#FAFAFA] cursor-pointer"
        >
          <div className="flex items-center gap-2 ">
            <InputLanguageIcon />
            <span className="text-gray-600 font-medium text-heading text-base">
              Input Language - Autodetect
            </span>
          </div>

          <div>
            <ChevronRight size={16} color="#454545" />
          </div>
        </div>
        <div
          onClick={toggleDropdown}
          className="flex justify-between gap-2 items-center px-6 py-3 rounded-full bg-gray-50 border border-gray-200 bg-[#FAFAFA] cursor-pointer"
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <HeadphoneIcon />
            <span className="text-gray-600 font-medium text-heading text-base">
              Audio -{" "}
              {selectedAudioDevice
                ? cleanDeviceLabel(selectedAudioDevice.label)
                : "Select a device"}
            </span>
          </div>

          <AudioDropdown
            audioDevices={audioDevices}
            selectedDevice={selectedAudioDevice}
            onDeviceSelect={setSelectedAudioDevice}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            toggleDropdown={toggleDropdown}
            cleanDeviceLabel={cleanDeviceLabel}
          />
        </div>
        <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-50 border border-gray-200 bg-[#FAFAFA]">
          <div className="border-2 border-[#A5A5A5] rounded-full h-4 w-4" />
          <span className="text-gray-600 font-medium text-heading text-base">
            Include System Audio
          </span>
        </div>
      </div>

      <div className="space-y-2 mt-16">
        <div className="flex items-center justify-center gap-2">
          <div className="border border-[#E5E5E5] flex rounded-full py-1 px-2 gap-2 shadow-sm cursor-pointer">
            <p className="text-xs font-semibold text-active">
              Get more minutes
            </p>
            <div className="flex items-center">
              <PrimaryArrowIcon />
            </div>
          </div>
        </div>
        <Button
          size={"lg"}
          className="flex items-center font-medium text-base leading-5 w-full"
          variant={"primary"}
          id="start"
          onClick={() => {
            if (
              isAuthentications &&
              (userPlan?.plan == "free" || userPlan?.plan === "personal")
            ) {
              setUpgradeToProScreen("proScreen");
            } else if (isAuthentications && userPlan?.plan == "pro") {
              setStartRecordings("startRecordings");
              handleStartRecording();
            } else {
              window.open("https://home.audionotes.app/", "_blank");
            }
          }}
        >
          <RecordIcon />
          Start recording
        </Button>
      </div>
    </form>
  );
};

export default RecentAudio;
