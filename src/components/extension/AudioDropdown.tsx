import { useRef, useEffect } from "react";
import { Check } from "lucide-react";
import AudioDropdownIcon from "../../assets/icons/AudioDropdownIcon";

const AudioDropdown = ({
  audioDevices,
  selectedDevice,
  onDeviceSelect,
  setIsOpen,
  isOpen,
  toggleDropdown,
}: any) => {
  const dropdownRef = useRef<any>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        <AudioDropdownIcon />
      </div>

      {isOpen && (
        <div className="absolute -right-6 mt-5 w-[350px] bg-white rounded-[22px] shadow-lg border border-gray-200 py-2 pb-1 z-50">
          {audioDevices.map((device: any) => (
            <div
              key={device.deviceId}
              className={`flex items-center justify-between px-3 cursor-pointer`}
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
                <span className="text-heading font-medium text-[14px] leading-5">
                  {device.label}
                </span>
                {selectedDevice?.deviceId === device.deviceId && (
                  <Check size={18} className="text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioDropdown;
