import React, { useState } from "react";
import { Mic, FileText, Play, AlertCircle } from "lucide-react";

const AudioRecorder = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [isRecording, setIsRecording] = useState(false);

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

  return (
    <div className="w-96 bg-white rounded-lg shadow-lg p-4 font-sans">
      {/* Header with Logo and Upgrade Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold">
            Audionotes<span className="text-orange-500">.app</span>
          </span>
        </div>
        <button className="bg-orange-50 text-orange-500 px-4 py-2 rounded-full font-medium">
          Upgrade Plan
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        <button
          className={`pb-2 px-1 ${
            activeTab === "record"
              ? "border-b-2 border-orange-500 text-black"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("record")}
        >
          Record Audio
        </button>
        <button
          className={`pb-2 px-1 flex items-center gap-2 ${
            activeTab === "recent"
              ? "border-b-2 border-orange-500 text-black"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("recent")}
        >
          <FileText className="w-5 h-5" />
          Recent Files
        </button>
      </div>

      {/* Content */}
      {activeTab === "record" ? (
        <div className="space-y-4">
          <p className="text-center text-gray-600 text-lg">
            To record zoom/google meet call click on include system audio
          </p>

          {/* System Audio Toggle */}
          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
            <div className="w-6 h-6 border-2 rounded-full"></div>
            <span className="text-gray-700 font-medium">
              Include System Audio
            </span>
          </div>

          {/* Language Selection */}
          <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">
                Input Language - Autodetect
              </span>
            </div>
            <span className="text-gray-400">›</span>
          </div>

          {/* Audio Input Selection */}
          <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border-2 border-blue-500">
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">
                Audio - Macbook Air Inbuilt
              </span>
            </div>
            <div className="flex gap-2">
              <button className="text-gray-400">⌃</button>
              <button className="text-gray-400">⌄</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {recentFiles.map((file) => (
            <div key={file.id} className="space-y-2">
              {file.status === "completed" ? (
                <>
                  <div className="flex items-center gap-3">
                    <button className="text-gray-600 hover:text-gray-800">
                      <Play className="w-5 h-5" />
                    </button>
                    <h3 className="text-gray-800 font-medium">{file.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm ml-8">
                    <span>
                      {file.date} · {file.time}
                    </span>
                  </div>
                  <div className="flex gap-3 ml-8">
                    <button className="px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm">
                      View Transcript
                    </button>
                    <button className="px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm">
                      View Summary
                    </button>
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

          <button className="w-full py-3 text-gray-600 bg-gray-50 rounded-lg mt-4">
            View More
          </button>
        </div>
      )}

      {/* Record Button */}
      <div className="mt-6">
        <button
          className={`w-full py-4 rounded-full text-white font-medium flex items-center justify-center gap-2 ${
            isRecording ? "bg-red-500" : "bg-orange-500"
          }`}
          onClick={() => setIsRecording(!isRecording)}
        >
          <div
            className={`w-3 h-3 rounded-full ${isRecording ? "bg-white" : ""}`}
          />
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
    </div>
  );
};

export default AudioRecorder;
