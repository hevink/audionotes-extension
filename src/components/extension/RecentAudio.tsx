import { useState, useEffect } from "react";
import InputLanguageIcon from "../../assets/icons/InputLanguageIcon";
import HeadphoneIcon from "../../assets/icons/HeadphoneIcon";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import RecordIcon from "../../assets/icons/RecordIcon";
import AudioDropdown from "./AudioDropdown";
import { useGetUserPlan } from "../../queries";
import { PrimaryArrowIcon } from "../../assets/icons/LeftArrowIcon";
import { truncateText } from "../../lib/utils";

interface RecentAudioProps {
  setShowLanguagesData: (value: string) => void;
  setStartRecordings: (value: string) => void;
  handleStartRecording: () => void;
  isAuthentications: boolean;
  setUpgradeToProScreen: (value: string) => void;
  storedLoginState: string | null;
  selectedLanguage: string | null | undefined | any;
}

const RecentAudio: React.FC<RecentAudioProps> = ({
  setShowLanguagesData,
  setStartRecordings,
  handleStartRecording,
  isAuthentications,
  setUpgradeToProScreen,
  storedLoginState,
  selectedLanguage,
}) => {
  const { data: userPlan, isLoading } = useGetUserPlan() as any;

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
    <div className="text-center px-4 mt-[38px]">
      <p className="text-sm text-active font-medium mb-2 leading-5">
        To record zoom/google meet call click on include system audio
      </p>
      <div className="space-y-2">
        <div
          onClick={() => setShowLanguagesData("setShowLanguagesData")}
          className="flex justify-between gap-2 items-center px-4 py-[14px] rounded-[22px] border border-[#F6F6F6] bg-inactive cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <InputLanguageIcon />
            <span className="text-heading font-medium leading-5 text-base">
              Input Language - {selectedLanguage?.name}
            </span>
          </div>

          <div>
            <ChevronRight size={16} color="#454545" />
          </div>
        </div>
        <div
          onClick={toggleDropdown}
          className="flex justify-between gap-2 items-center px-4 py-[14px] rounded-[22px] bg-gray-50 border border-[#F6F6F6] bg-inactive cursor-pointer"
        >
          <div className="flex items-center gap-1.5 cursor-pointer">
            <HeadphoneIcon />
            <span className="font-medium text-heading text-base">
              Audio -{" "}
              {selectedAudioDevice
                ? truncateText(cleanDeviceLabel(selectedAudioDevice.label),24)
                : "Select a device"}
            </span>
          </div>

          <AudioDropdown
            audioDevices={audioDevices}
            selectedDevice={selectedAudioDevice}
            onDeviceSelect={setSelectedAudioDevice}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            cleanDeviceLabel={cleanDeviceLabel}
          />
        </div>
        <div className="flex items-center gap-1.5 px-4 py-[14px] rounded-[22px] bg-gray-50 border border-[#F6F6F6] bg-inactive">
          <div className="border-2 border-[#A5A5A5] rounded-full h-4 w-4" />
          <span className="text-gray-600 font-medium text-heading text-base">
            Include System Audio
          </span>
        </div>
      </div>

      <div className="space-y-2 mt-16">
        <div className="flex items-center justify-center">
          <div
            onClick={() =>
              window.open("https://home.audionotes.app/", "_blank")
            }
            className="border border-[#E5E5E5] flex items-center justify-center rounded-full py-[2px] px-1.5 gap-2 cursor-pointer"
          >
            <p className="text-xs font-semibold text-active leading-5">
              Get more minutes
            </p>
            <div className="flex items-center">
              <PrimaryArrowIcon />
            </div>
          </div>
        </div>
        <Button
          size={"lg"}
          className="flex items-center font-medium text-base leading-5 w-full gap-1"
          variant={"primary"}
          id="start"
          disabled={isLoading}
          onClick={() => {
            if (isAuthentications) {
              if (storedLoginState === "true" && userPlan?.plan !== "pro") {
                setUpgradeToProScreen("proScreen");
              } else if (
                storedLoginState === "false" &&
                (userPlan?.plan == "free" || userPlan?.plan === "personal")
              ) {
                setStartRecordings("startRecordings");
                handleStartRecording();
              } else if (
                storedLoginState === "false" &&
                userPlan?.plan == "pro"
              ) {
                setStartRecordings("startRecordings");
                handleStartRecording();
              } else {
                window.open("https://home.audionotes.app/", "_blank");
              }
            } else {
              window.open("https://home.audionotes.app/", "_blank");
            }
          }}
        >
          <RecordIcon />
          Start recording
        </Button>
      </div>
    </div>
  );
};

export default RecentAudio;
