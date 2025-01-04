import { useRef, useEffect } from "react";
import { Check } from "lucide-react";
import AudioDropdownIcon from "../../assets/icons/AudioDropdownIcon";

interface AudioDevice {
  deviceId: string;
  label: string;
}

interface AudioDropdownProps {
  audioDevices: AudioDevice[];
  selectedDevice: AudioDevice | null;
  onDeviceSelect: (device: AudioDevice) => void;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  cleanDeviceLabel: (label: string) => string;
}

const AudioDropdown: React.FC<AudioDropdownProps> = ({
  audioDevices,
  selectedDevice,
  onDeviceSelect,
  setIsOpen,
  isOpen,
  cleanDeviceLabel,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter out default device and clean labels
  const filteredDevices = audioDevices.filter(
    (device) => device.deviceId !== "default"
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="cursor-pointer">
        <AudioDropdownIcon />
      </div>

      {isOpen && (
        <div className="absolute -right-6 mt-5 w-[350px] bg-white rounded-[22px] shadow-lg border border-gray-200 py-2 pb-1 z-50">
          {filteredDevices.length > 0 && filteredDevices[0]?.deviceId !== "" ? (
            filteredDevices.map((device) => (
              <div
                key={device.deviceId}
                className="flex items-center justify-between px-3 pb-1 cursor-pointer"
                onClick={() => {
                  onDeviceSelect(device);
                  setIsOpen(false);
                }}
              >
                <div
                  className={`flex items-center justify-between w-full px-4 py-3 ${
                    selectedDevice?.deviceId === device.deviceId
                      ? "bg-plain rounded-full"
                      : ""
                  }`}
                >
                  <span className="text-heading font-medium text-[15px] leading-5">
                    {cleanDeviceLabel(device.label)}
                  </span>
                  {selectedDevice?.deviceId === device.deviceId && (
                    <Check size={18} className="text-primary" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-5">No device found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioDropdown;
