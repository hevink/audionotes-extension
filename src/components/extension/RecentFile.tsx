import React from "react";
import { Button } from "../ui/button";
import RecordIcon from "../../assets/icons/RecordIcon";
import RecentFileItem from "./RecentFileItem";
import { useGetInitialNotes } from "../../queries";

type RecentFileProps = {
  recentFiles: {
    id: string;
    status: string;
    title: string;
    date?: string;
    time?: string;
    message?: string;
  }[];
  setSendMail: (value: string) => void;
  handleStartRecording: () => void;
  setStartRecordings: (value: string) => void;
};

const RecentFile: React.FC<RecentFileProps> = ({
  recentFiles,
  setSendMail,
  handleStartRecording,
  setStartRecordings,
}) => {
  const { data: notes = [], isPending: isInitialLoading } =
    useGetInitialNotes();
  return (
    <div className="space-y-4 px-4 pb-4">
      {notes.map((note) => (
        <RecentFileItem key={note.id} note={note} setSendMail={setSendMail} />
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
