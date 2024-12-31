import { useRef, useEffect } from "react";
import { Check } from "lucide-react";
import AudioDropdownIcon from "../../assets/icons/AudioDropdownIcon";

const AudioDropdown = ({
  selectedDevice,
  onDeviceSelect,
  setIsOpen,
  isOpen,
  toggleDropdown,
}: any) => {
  const dropdownRef = useRef<any>(null);

  const audioDevices = [
    { id: 1, name: "Macbook Air Inbuilt" },
    { id: 2, name: "Oneplus X2 earphones" },
  ];

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
        <div className="absolute -right-6 mt-5 w-[350px] bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {audioDevices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                onDeviceSelect(device);
                setIsOpen(false);
              }}
            >
              <span className="text-gray-700">{device.name}</span>
              {selectedDevice?.id === device.id && (
                <Check size={16} className="text-orange-500" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioDropdown;
