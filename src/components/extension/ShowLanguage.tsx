import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useGetLanguages } from "../../queries";
import LeftArrowIcon from "../../assets/icons/LeftArrowIcon";

const ShowLanguage = ({ setShowLanguagesData }: any) => {
  const { data: languages = [], isLoading } = useGetLanguages();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]?.name);

  useEffect(() => {
    if (languages.length > 0) {
      setSelectedLanguage(languages[selectedIndex]);
    }
  }, [selectedIndex, languages]);

  return (
    <div className="p-4">
      <div className="relative flex items-center justify-center mb-8">
        <div className="rounded-full absolute left-0">
          <div
            onClick={() => setShowLanguagesData("")}
            className="bg-plain rounded-full p-0.5 cursor-pointer"
          >
            <LeftArrowIcon />
          </div>
        </div>
        <h2 className="text-base font-semibold">Input Language</h2>
      </div>

      {isLoading ? (
        <div className="h-[450px] flex items-center justify-center">
          <Loader2 size={32} className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="" tabIndex={0}>
            {languages.map((language, index) => (
              <div
                key={language.id}
                className={`p-2.5 cursor-pointer flex items-center justify-between rounded-full ${
                  selectedIndex === index ? "bg-[#F8F8F8]" : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSelectedIndex(index);
                  setSelectedLanguage(language);
                }}
              >
                <span className="text-base text-foreground font-medium leading-5">
                  {language.name}
                </span>
                {selectedLanguage?.id === language.id && (
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

            <Button
              onClick={() => setShowLanguagesData(selectedLanguage)}
              variant={"secondary"}
              size="lg"
              className="w-full mt-4"
            >
              Save
            </Button>
        </>
      )}
    </div>
  );
};

export default ShowLanguage;
