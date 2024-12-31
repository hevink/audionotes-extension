import { useState } from "react";
import { Card } from "../ui/card";
import { FileText } from "lucide-react";
import EmailShare from "./EmailShare";
import Header from "../commonComponent/Header";
import RecentAudio from "./RecentAudio";
import RecentFile from "./RecentFile";
import AuthScreen from "./AuthScreen";
import ShowLanguage from "./ShowLanguage";
import RecordAudio from "./RecordAudio";
import UpgradePlan from "./UpgradePlan";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("audio");
  const [sendMail, setSendMail] = useState("");
  const [showLanguagesData, setShowLanguagesData] = useState("");
  const [startRecordings, setStartRecordings] = useState("");
  const [upgradePlan, setUpgradePlan] = useState("");

  const recentFiles = [
    {
      id: 1,
      title: "Designing Luck Through Hard Work",
      date: "Aug 16, 2024",
      time: "10:23 PM",
      status: "completed",
    },
    {
      id: 2,
      title: "Designing Luck Through Hard Work",
      date: "Aug 16, 2024",
      time: "10:23 PM",
      status: "completed",
    },
    {
      id: 3,
      title: "Processing Failed",
      status: "failed",
      message: "We're facing a delay. Your audio will be processed soon.",
    },
  ];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(e);
  };

  const handleTabSwitch = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center">
        <Card className="w-96 bg-white rounded-[20px] py-2 border-none">
          {sendMail === "showDetails" ? (
            <EmailShare setSendMail={setSendMail} />
          ) : showLanguagesData === "setShowLanguagesData" ? (
            <ShowLanguage setShowLanguagesData={setShowLanguagesData} />
          ) : startRecordings === "startRecordings" ? (
            <RecordAudio />
          ) : upgradePlan === "upgradePlan" ? (
            <UpgradePlan setUpgradePlan={setUpgradePlan} />
          ) : (
            <>
              {" "}
              {/* Header */}
              <Header setUpgradePlan={setUpgradePlan} />
              {/* Tabs */}
              <div className="flex mb-6">
                <button
                  className={`flex-1 font-medium transition-colors p-4 ${
                    activeTab === "audio"
                      ? "border-b-2 border-orange-500 text-gray-900"
                      : "border-b-2 border-gray-100 text-[#9A9A9A] bg-[#F8F8F8]"
                  }`}
                  onClick={() => handleTabSwitch("audio")}
                >
                  Record Audio
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 transition-colors p-4 ${
                    activeTab === "files"
                      ? "border-b-2 border-orange-500 text-gray-900"
                      : "border-b-2 border-gray-100 text-[#9A9A9A] bg-[#F8F8F8]"
                  }`}
                  onClick={() => handleTabSwitch("files")}
                >
                  <FileText className="w-5 h-5" />
                  Recent Files
                </button>
              </div>
              {/* Content */}
              {activeTab === "audio" ? (
                <RecentAudio
                  handleSubmit={handleSubmit}
                  setShowLanguagesData={setShowLanguagesData}
                  setStartRecordings={setStartRecordings}
                />
              ) : (
                // <RecentFile
                //   recentFiles={recentFiles}
                //   setSendMail={setSendMail}
                // />
                <AuthScreen />
              )}
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default HomePage;
