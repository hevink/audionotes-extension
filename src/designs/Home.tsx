import { useState } from "react";
import { Card } from "../components/ui/card";
import { Mic, FileText, Play, AlertCircle, Dot } from "lucide-react";
import { Button } from "../components/ui/button";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");

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
    // Handle generate functionality here
    console.log("Generating transcript for:", youtubeUrl);
  };

  const handleTabSwitch = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div className=" bg-gray-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-[450px] bg-white rounded-[20px] py-2 border-none">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-4 pt-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1 rounded-lg">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm font-semibold">
              Audionotes<span className="text-primary">.app</span>
            </h1>
          </div>
          <button className="bg-[#FFE9DF] text-primary px-3 py-1 rounded-full font-medium">
            Upgrade Plan
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            className={`flex-1 font-medium transition-colors p-4 ${
              activeTab === "youtube"
                ? "border-b-2 border-orange-500 text-gray-900"
                : "border-b-2 border-gray-100 text-gray-400 bg-[#F8F8F8]"
            }`}
            onClick={() => handleTabSwitch("youtube")}
          >
            Record Audio
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 transition-colors p-4 ${
              activeTab === "files"
                ? "border-b-2 border-orange-500 text-gray-900"
                : "border-b-2 border-gray-100 text-gray-400 bg-[#F8F8F8]"
            }`}
            onClick={() => handleTabSwitch("files")}
          >
            <FileText className="w-5 h-5" />
            Recent Files
          </button>
        </div>

        {/* Content */}
        {activeTab === "youtube" ? (
          <form onSubmit={handleSubmit} className="text-center mb-8 px-4">
            <p className="text-sm text-active font-medium mb-8">
              To record zoom/google meet call click on include system audio
            </p>
            <div className="relative mb-4">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/"
                className="w-full px-6 py-4 rounded-full text-gray-600 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder:text-gray-400"
              />
            </div>
            <Button
              size="lg"
              className="w-full rounded-full py-4 font-medium bg-[#FF3030] text-white"
            >
              Start Recording
            </Button>
          </form>
        ) : (
          <div className="space-y-6 px-4">
            {recentFiles.map((file) => (
              <div key={file.id} className="space-y-2">
                {file.status === "completed" ? (
                  <>
                    <div className="flex items-center gap-3">
                      <button className="text-gray-600 hover:text-gray-800">
                        <Play className="w-5 h-5" />
                      </button>
                      <h3 className="text-gray-800 font-medium">
                        {file.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm ml-8">
                      <span>
                        {file.date} · {file.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 ">
                      <Button
                        variant="outline"
                        className="px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm"
                      >
                        Transcript
                      </Button>
                      <Button
                        variant="outline"
                        className="px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm"
                      >
                        Summary
                      </Button>
                      <Button
                        variant="outline"
                        className="px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm"
                      >
                        Share via Email
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-500">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">{file.title}</span>
                    </div>
                    <p className="text-gray-400 ml-7">{file.message}</p>
                  </div>
                )}
              </div>
            ))}

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full rounded-full font-semibold text-[15px] py-4"
              >
                Start Recording
              </Button>
              <Button className="w-full rounded-full font-medium bg-[#FF3030] text-white text-base">
                <div>
                  <Dot className="size-5" />
                </div>
                Start Recording
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HomePage;
