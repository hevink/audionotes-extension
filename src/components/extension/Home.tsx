import { useCallback, useEffect, useState } from "react";
import { FileText } from "lucide-react";
import EmailShare from "./EmailShare";
import Header from "../commonComponent/Header";
import RecentAudio from "./RecentAudio";
import RecentFile from "./RecentFile";
import ShowLanguage from "./ShowLanguage";
import RecordAudio from "./RecordAudio";
import UpgradePlan from "./UpgradePlan";
import { useAudioRecorder } from "react-audio-voice-recorder";
import AuthScreen from "./AuthScreen";
import UpgradeToPro from "./UpgradeToPro";
import { useGetLanguages, useGetUser, useUpdateUser } from "../../queries";

// ----------------------------------------------------------------

interface HomePageProps {
  isAuthentications: boolean | null;
  isFirstTimeLogin: boolean | string | null;
  setIsFirstTimeLogin: (value: boolean) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  isAuthentications,
  isFirstTimeLogin,
  setIsFirstTimeLogin,
}: any) => {
  // Manage extension screens ...
  const [activeTab, setActiveTab] = useState("audio");
  const [sendMail, setSendMail] = useState("");
  const [showLanguagesData, setShowLanguagesData] = useState("");
  const [startRecordings, setStartRecordings] = useState("");
  const [upgradePlan, setUpgradePlan] = useState("");
  const [upgradeToProScreen, setUpgradeToProScreen] = useState("");

  // recording states ...
  const [isRecordingAllow, setIsRecordingAllow] = useState(true);
  const [recordingStopped, setRecordingStopped] = useState(false); // State to track if recording is stopped
  const [recordingStarted, setRecordingStarted] = useState(false); // State to track if recording has started
  const [isAudioPending, setIsAudioPending] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // Show language states ...
  const { data: languages = [], isLoading: isGetLanguageLoading } =
    useGetLanguages();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // User's states and mutation ...
  const { data: user } = useGetUser();
  const updateUserMutation = useUpdateUser();

  const {
    startRecording,
    stopRecording,
    recordingTime,
    recordingBlob,
    mediaRecorder,
    togglePauseResume,
    isPaused,
  } = useAudioRecorder();

  // Effect to set initial language based on user's input_language code
  useEffect(() => {
    if (user?.input_language?.code && languages.length > 0) {
      const userLanguage = languages.find(
        (lang) => lang.code === user.input_language.code
      );
      if (userLanguage) {
        setSelectedLanguage(userLanguage);
        setSelectedIndex(languages.indexOf(userLanguage));
      } else {
        // Fallback to English if user's language not found
        const defaultLanguage = languages.find(
          (lang) => lang.code === "autodetect"
        );
        if (defaultLanguage) {
          setSelectedLanguage(defaultLanguage);
          setSelectedIndex(languages.indexOf(defaultLanguage));
        }
      }
    }
  }, [user?.input_language?.code, languages]);

  const handleUpdate = async (code: string) => {
    updateUserMutation.mutate({
      input_language: code,
    });
  };

  const handleStartRecording = useCallback(() => {
    setIsCancelled(false);
    startRecording();
    setRecordingStarted(true);
    setRecordingStopped(false); // Reset stopped state
  }, [startRecording]);

  //
  const handleStopRecording = useCallback(() => {
    if (recordingStarted && !recordingStopped) {
      // Stop the recording if it was started and not already stopped
      stopRecording();
      setIsRecordingAllow(false);
      setRecordingStopped(true); // Mark recording as stopped
    } else {
      // Restart recording if it was canceled or stopped

      handleStartRecording();
      setRecordingStopped(false); // Reset stopped state
    }
  }, [
    stopRecording,
    recordingTime,
    recordingStarted,
    recordingStopped,
    handleStartRecording,
  ]);

  const handlePending = useCallback((type: "audio", value: boolean) => {
    if (type === "audio") {
      setIsAudioPending(value);
    }
  }, []);

  // Function to handle upgrade plan visibility
  const handleUpgradePlan = (value: string) => {
    setStartRecordings(""); // Clear the recording state
    setUpgradePlan(value); // Set the upgrade plan state
  };

  const renderScreens = () => {
    if (sendMail === "showDetails") {
      return <EmailShare setSendMail={setSendMail} />;
    }

    if (showLanguagesData === "setShowLanguagesData") {
      return (
        <ShowLanguage
          setShowLanguagesData={setShowLanguagesData}
          languages={languages}
          isLoading={isGetLanguageLoading}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          handleUpdate={handleUpdate}
        />
      );
    }

    if (startRecordings === "startRecordings") {
      return (
        <RecordAudio
          stopRecording={stopRecording}
          recordingTime={recordingTime}
          recordingBlob={recordingBlob}
          mediaRecorder={mediaRecorder}
          togglePauseResume={togglePauseResume}
          isRecordingAllow={isRecordingAllow}
          recordingStopped={recordingStopped}
          setRecordingStopped={setRecordingStopped}
          setRecordingStarted={setRecordingStarted}
          handleStopRecording={handleStopRecording}
          handlePending={handlePending}
          setActiveTab={setActiveTab}
          setStartRecordings={setStartRecordings}
          isAudioPending={isAudioPending}
          setUpgradePlan={handleUpgradePlan}
          setUpgradeToProScreen={setUpgradeToProScreen}
          isPaused={isPaused}
          setIsCancelled={setIsCancelled}
          isCancelled={isCancelled}
          setIsRecordingAllow={setIsRecordingAllow}
        />
      );
    }

    if (upgradePlan === "upgradePlan") {
      return (
        <UpgradePlan
          setUpgradePlan={setUpgradePlan}
          setUpgradeToProScreen={setUpgradeToProScreen}
          setActiveTab={setActiveTab}
        />
      );
    }

    if (upgradeToProScreen === "proScreen") {
      return (
        <UpgradeToPro
          setStartRecordings={setStartRecordings}
          handleStartRecording={handleStartRecording}
          setActiveTab={setActiveTab}
          setUpgradeToProScreen={setUpgradeToProScreen}
          setUpgradePlan={setUpgradePlan}
          setIsFirstTimeLogin={setIsFirstTimeLogin}
        />
      );
    }
    return (
      <>
        {" "}
        <Header
          setUpgradePlan={setUpgradePlan}
          isAuthentications={isAuthentications}
        />
        <div className="flex border">
          {["audio", "files"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 font-semibold text-base p-4  flex items-center justify-center gap-1 text-base ${
                activeTab === tab
                  ? "border-b-2 border-primary text-gray-900"
                  : "border-b border-gray-100 text-[#9A9A9A] bg-[#F8F8F8]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "files" && <FileText className="size-4" />}
              {tab === "audio" ? "Record Audio" : "Recent Files"}
            </button>
          ))}
        </div>
        {activeTab === "audio" ? (
          <RecentAudio
            setShowLanguagesData={setShowLanguagesData}
            setStartRecordings={setStartRecordings}
            handleStartRecording={handleStartRecording}
            isAuthentications={isAuthentications}
            setUpgradeToProScreen={setUpgradeToProScreen}
            storedLoginState={isFirstTimeLogin}
            selectedLanguage={selectedLanguage}
          />
        ) : isAuthentications ? (
          <RecentFile
            setSendMail={setSendMail}
            handleStartRecording={handleStartRecording}
            setStartRecordings={setStartRecordings}
            isAuthentications={isAuthentications}
            setUpgradeToProScreen={setUpgradeToProScreen}
            storedLoginState={isFirstTimeLogin}
          />
        ) : (
          <AuthScreen isAuthentications={isAuthentications} />
        )}
      </>
    );
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="w-96">{renderScreens()}</div>
      </div>
    </>
  );
};

export default HomePage;
