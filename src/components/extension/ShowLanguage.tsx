import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useGetLanguages } from "../../queries";

const ShowLanguage = ({ setShowLanguagesData }: any) => {
  const { data: languages = [], isLoading } = useGetLanguages();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  if (isLoading) return <div>Loading...</div>;

  const handleKeyDown = (e: any) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : languages.length - 1
        );
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < languages.length - 1 ? prev + 1 : 0
        );
        break;
      case "Enter":
        setSelectedLanguage(languages[selectedIndex]);
        break;
    }
  };

  useEffect(() => {
    // Update selected language when index changes
    setSelectedLanguage(languages[selectedIndex]);
  }, [selectedIndex]);

  return (
    <div className="p-4">
      <div className="relative flex items-center justify-center">
        <div className="rounded-full absolute left-0">
          <div
            onClick={() => setShowLanguagesData("")}
            className="bg-plain rounded-full p-1 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 text-subheading" />
          </div>
        </div>
        <h2 className="text-base font-semibold">Input Language</h2>
      </div>

      <div className="p-2" tabIndex={0} onKeyDown={handleKeyDown}>
        {languages.map((language, index) => (
          <div
            key={language.id}
            className={`p-4 cursor-pointer flex items-center justify-between rounded-full ${
              selectedIndex === index ? "bg-[#F8F8F8] " : "hover:bg-gray-50"
            }`}
            onClick={() => {
              setSelectedIndex(index);
              setSelectedLanguage(language);
            }}
          >
            <span className="text-base">{language.name}</span>
            {selectedLanguage.id === language.id && (
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      <div className="p-4">
        <Button
          onClick={() => setShowLanguagesData(selectedLanguage)}
          variant={"secondary"}
          className="w-full rounded-full py-6"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ShowLanguage;
