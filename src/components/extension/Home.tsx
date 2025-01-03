import { useCallback, useState } from "react";
import { Card } from "../ui/card";
import { FileText } from "lucide-react";
import EmailShare from "./EmailShare";
import Header from "../commonComponent/Header";
import RecentAudio from "./RecentAudio";
import RecentFile from "./RecentFile";
// import AuthScreen from "./AuthScreen";
import ShowLanguage from "./ShowLanguage";
import RecordAudio from "./RecordAudio";
import UpgradePlan from "./UpgradePlan";
import { useAudioRecorder } from "react-audio-voice-recorder";
import AuthScreen from "./AuthScreen";
import UpgradeToPro from "./UpgradeToPro";

// ----------------------------------------------------------------

const HomePage = ({ isAuthentications }: any) => {
  const storedLoginState = sessionStorage.getItem("isFirstTimeLogin");

  //
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

  const {
    startRecording,
    stopRecording,
    recordingTime,
    recordingBlob,
    mediaRecorder,
    togglePauseResume,
  } = useAudioRecorder();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(e);
  };

  const handleTabSwitch = (tab: any) => {
    setActiveTab(tab);
  };

  const handleStartRecording = useCallback(() => {
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
      <div className="bg-gray-100 flex items-center justify-center">
        <Card className="w-96 bg-white rounded-[20px] border-none">
          {sendMail === "showDetails" ? (
            <EmailShare setSendMail={setSendMail} />
          ) : showLanguagesData === "setShowLanguagesData" ? (
            <ShowLanguage setShowLanguagesData={setShowLanguagesData} />
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
              <div className="flex mb-[38px] border">
                <button
                  className={`flex-1 font-semibold leading-5 text-base p-4 ${
                    activeTab === "audio"
                      ? "border-b-2 border-primary text-gray-900"
                      : "border-b-2 border-gray-100 text-[#9A9A9A] bg-[#F8F8F8]"
                  }`}
                  onClick={() => handleTabSwitch("audio")}
                >
                  Record Audio
                </button>
                <button
                  className={`flex-1 font-semibold leading-5 flex items-center justify-center gap-1 text-base p-4 ${
                    activeTab === "files"
                      ? "border-b-2 border-primary text-gray-900"
                      : "border-b-2 border-gray-100 text-[#9A9A9A] bg-[#F8F8F8]"
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
                  handleSubmit={handleSubmit}
                  setShowLanguagesData={setShowLanguagesData}
                  setStartRecordings={setStartRecordings}
                  handleStartRecording={handleStartRecording}
                  isAuthentications={isAuthentications}
                  setUpgradeToProScreen={setUpgradeToProScreen}
                  storedLoginState={storedLoginState}
                />
              ) : isAuthentications ? (
                <RecentFile
                  setSendMail={setSendMail}
                  handleStartRecording={handleStartRecording}
                  setStartRecordings={setStartRecordings}
                  isAuthentications={isAuthentications}
                  setUpgradeToProScreen={setUpgradeToProScreen}
                />
              ) : (
                <AuthScreen isAuthentications={isAuthentications} />
              )}
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default HomePage;
