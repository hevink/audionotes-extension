import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { LeftArrowIcon } from "../../assets/icons/LeftArrowIcon";
import { ScrollArea } from "../ui/scroll-area";

interface ShowLanguageProps {
  setShowLanguagesData: (value: string) => void;
  languages: string[];
  isLoading: boolean;
  selectedIndex: number | null;
  setSelectedIndex: (index: number) => void;
  selectedLanguage: null | any;
  setSelectedLanguage: (language: string) => void;
  handleUpdate: (languageCode: string) => void;
}

const ShowLanguage: React.FC<ShowLanguageProps> = ({
  setShowLanguagesData,
  languages,
  isLoading,
  selectedIndex,
  setSelectedIndex,
  selectedLanguage,
  setSelectedLanguage,
  handleUpdate,
}) => {
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
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <>
          <ScrollArea className="h-[388px] pr-4">
            <div className="" tabIndex={0}>
              {languages.map((language: any, index: number) => {
                console.log(language, "language");

                return (
                  <div
                    key={language.id}
                    className={`p-2.5 cursor-pointer flex items-center justify-between rounded-full ${
                      selectedIndex === index
                        ? "bg-[#F8F8F8]"
                        : "hover:bg-gray-50"
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
                );
              })}
            </div>
          </ScrollArea>

          <Button
            onClick={() => {
              setShowLanguagesData(selectedLanguage);
              handleUpdate(selectedLanguage?.code);
            }}
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
