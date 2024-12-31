import { useState } from "react";
import InputLanguageIcon from "../../assets/icons/InputLanguageIcon";
import HeadphoneIcon from "../../assets/icons/HeadphoneIcon";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import RecordIcon from "../../assets/icons/RecordIcon";
import AudioDropdown from "./AudioDropdown";

const RecentAudio = ({
  handleSubmit,
  setShowLanguagesData,
  setStartRecordings,
}: any) => {
  const [selectedAudioDevice, setSelectedAudioDevice] = useState({
    id: 1,
    name: "MacBook Air Inbuilt",
  });
  const [isOpen, setIsOpen] = useState(false);

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
          className="flex justify-between gap-2 items-center px-6 py-3 rounded-full bg-gray-50 border border-gray-200 bg-[#FAFAFA]"
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <InputLanguageIcon />
            <span className="text-gray-600 font-medium text-heading text-base">
              Input Language - Autodetect
            </span>
          </div>

          <div>
            <ChevronRight
              size={16}
              color="#454545"
              className="cursor-pointer"
            />
          </div>
        </div>
        <div className="flex justify-between gap-2 items-center px-6 py-3 rounded-full bg-gray-50 border border-gray-200 bg-[#FAFAFA]">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <HeadphoneIcon />
            <span className="text-gray-600 font-medium text-heading text-base">
              Audio - {selectedAudioDevice.name}
            </span>
          </div>

          <AudioDropdown
            selectedDevice={selectedAudioDevice}
            onDeviceSelect={setSelectedAudioDevice}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            toggleDropdown={toggleDropdown}
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
          <div className="border border-[#E5E5E5] flex rounded-full py-1 px-2 gap-2 shadow-md cursor-pointer">
            <p className="text-sm font-semibold text-active">
              Get more minutes
            </p>
            <div className="bg-primary rounded-full p-1">
              <ArrowRight size={13} className="text-white" />
            </div>
          </div>
        </div>
        <Button
          size={"lg"}
          className="flex items-center font-medium text-base leading-5 w-full"
          variant={"primary"}
          onClick={() => setStartRecordings("startRecordings")}
        >
          <RecordIcon />
          Stop recording
        </Button>
      </div>
    </form>
  );
};

export default RecentAudio;
