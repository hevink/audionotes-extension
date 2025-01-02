import { AlertCircle, Play, Send } from "lucide-react";
import { Button } from "../ui/button";
import RecordIcon from "../../assets/icons/RecordIcon";

const RecentFile = ({
  recentFiles,
  setSendMail,
  handleStartRecording,
  setStartRecordings,
}: any) => {
  return (
    <div className="space-y-4 px-4 pb-4">
      {recentFiles.map((file: any) => (
        <div key={file.id} className="space-y-2">
          {file.status === "completed" ? (
            <div>
              <div className="flex gap-3">
                <div>
                  <button className="text-gray-600 hover:text-gray-800">
                    <Play className="w-5 h-5" fill="#212121" />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-800 font-medium">{file.title}</p>

                  <p className="flex items-center gap-2 text-date text-sm font-medium">
                    {file.date} · {file.time}
                  </p>

                  <div className="flex items-center space-x-2">
                    <div className="px-3 py-2 rounded-full text-heading text-xs font-semibold bg-[#F3F3F3] cursor-pointer">
                      Transcript
                    </div>
                    <div className="px-3 py-2 rounded-full text-heading text-xs font-semibold bg-[#F3F3F3] cursor-pointer">
                      Summary
                    </div>
                    <div
                      className="flex items-center space-x-1 px-3 py-2 rounded-full text-xs text-heading font-semibold whitespace-nowrap bg-[#F3F3F3] cursor-pointer"
                      onClick={() => setSendMail("showDetails")}
                    >
                      <Send size={15} />
                      <span>Share via Email</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-[1px] border-[#F1F5FA] mt-2" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-500">
                <div className="bg-plain rounded-full p-1">
                  <AlertCircle className="w-5 h-5 text-white" fill="#FF3300" />
                </div>
                <span className="font-medium">{file.title}</span>
              </div>
              <p className="text-date ml-7">{file.message}</p>
            </div>
          )}
        </div>
      ))}

      <div className="space-y-2">
        <Button
          className="w-full rounded-full font-semibold text-[15px] py-6"
          variant={"plain"}
        >
          View More
        </Button>
        <Button
          size={"lg"}
          className="flex items-center font-medium text-base leading-5 w-full"
          variant={"primary"}
          onClick={() => {
            setStartRecordings("startRecordings");
            handleStartRecording();
          }}
        >
          <RecordIcon />
          Start recording
        </Button>
      </div>
    </div>
  );
};

export default RecentFile;
