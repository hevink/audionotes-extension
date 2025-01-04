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

const HomePage = ({
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
  const [isTextPending, setIsTextPending] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // Show language states ...
  const { data: languages = [], isLoading: isGetLanguageLoading } =
    useGetLanguages();
  // const { isLoading } = useGetUserPlan() as any;

  const { data: user } = useGetUser();
  const updateUserMutation = useUpdateUser();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState();

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

  const handleTabSwitch = (tab: any) => {
    setActiveTab(tab);
  };

  const handleStartRecording = useCallback(() => {
    setIsCancelled(false);
    startRecording();
    setRecordingStarted(true);
    setRecordingStopped(false); // Reset stopped state
    console.log("ahhh ....");
  }, [startRecording]);

  //
  const handleStopRecording = useCallback(() => {
    if (recordingStarted && !recordingStopped) {
      // Stop the recording if it was started and not already stopped
      stopRecording();
      setIsRecordingAllow(false);
      setRecordingStopped(true); // Mark recording as stopped
      console.log("Greate ...");
    } else {
      // Restart recording if it was canceled or stopped
      console.log("ahhh ....");

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

  const handlePending = useCallback(
    (type: "text" | "audio", value: boolean) => {
      if (type === "text") {
        setIsTextPending(value);
      } else {
        setIsAudioPending(value);
      }
    },
    []
  );

  // Function to handle upgrade plan visibility
  const handleUpgradePlan = (value: string) => {
    setStartRecordings(""); // Clear the recording state
    setUpgradePlan(value); // Set the upgrade plan state
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="w-96">
          {sendMail === "showDetails" ? (
            <EmailShare setSendMail={setSendMail} />
          ) : showLanguagesData === "setShowLanguagesData" ? (
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
          ) : startRecordings === "startRecordings" ? (
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
              isTextPending={isTextPending}
              isAudioPending={isAudioPending}
              setUpgradePlan={handleUpgradePlan}
              setUpgradeToProScreen={setUpgradeToProScreen}
              isPaused={isPaused}
              setIsCancelled={setIsCancelled}
              isCancelled={isCancelled}
              setIsRecordingAllow={setIsRecordingAllow}
            />
          ) : upgradePlan === "upgradePlan" ? (
            <UpgradePlan
              setUpgradePlan={setUpgradePlan}
              setUpgradeToProScreen={setUpgradeToProScreen}
              setActiveTab={setActiveTab}
            />
          ) : upgradeToProScreen === "proScreen" ? (
            <UpgradeToPro
              setStartRecordings={setStartRecordings}
              handleStartRecording={handleStartRecording}
              setActiveTab={setActiveTab}
              setUpgradeToProScreen={setUpgradeToProScreen}
              setUpgradePlan={setUpgradePlan}
              setIsFirstTimeLogin={setIsFirstTimeLogin}
            />
          ) : (
            <>
              {" "}
              {/* Header */}
              <Header
                setUpgradePlan={setUpgradePlan}
                isAuthentications={isAuthentications}
              />
              {/* Tabs */}
              <div className="flex border">
                <button
                  className={`flex-1 font-semibold leading-5 text-base p-4 ${
                    activeTab === "audio"
                      ? "border-b-2 border-primary text-gray-900"
                      : "border-b border-gray-100 text-[#9A9A9A] bg-[#F8F8F8]"
                  }`}
                  onClick={() => handleTabSwitch("audio")}
                >
                  Record Audio
                </button>
                <button
                  className={`flex-1 font-semibold leading-5 flex items-center justify-center gap-1 text-base p-4 ${
                    activeTab === "files"
                      ? "border-b-2 border-primary text-gray-900"
                      : "border-b border-gray-100 text-[#9A9A9A] bg-[#F8F8F8]"
                  }`}
                  onClick={() => handleTabSwitch("files")}
                >
                  <FileText className="size-4" />
                  Recent Files
                </button>
              </div>
              {/* Content */}
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
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
