import React from "react";
import { Button } from "../ui/button";
import RecordIcon from "../../assets/icons/RecordIcon";
import RecentFileItem from "./RecentFileItem";
import { useGetInitialNotes, useGetUserPlan } from "../../queries";

type RecentFileProps = {
  setSendMail: (value: string) => void;
  handleStartRecording: () => void;
  setStartRecordings: (value: string) => void;
  isAuthentications: boolean;
  setUpgradeToProScreen: (value: string) => void;
};

const RecentFile: React.FC<RecentFileProps> = ({
  setSendMail,
  handleStartRecording,
  setStartRecordings,
  isAuthentications,
  setUpgradeToProScreen,
}) => {
  const { data: notes = [], isPending: isInitialLoading } =
    useGetInitialNotes();
  const { data: userPlan } = useGetUserPlan() as any;

  return (
    <div className="space-y-4 px-4 pb-4">
      {notes.map((note, index) => (
        <RecentFileItem key={note.id} note={note} setSendMail={setSendMail} />
      ))}

      <div className="space-y-2">
        <Button
          className="w-full rounded-full font-semibold text-[15px] py-6"
          variant={"plain"}
          onClick={() => window.open("https://home.audionotes.app/", "_blank")}
        >
          View More
        </Button>
        <Button
          size={"lg"}
          className="flex items-center font-medium text-base leading-5 w-full"
          variant={"primary"}
          onClick={() => {
            if (
              isAuthentications &&
              (userPlan?.plan == "free" || userPlan?.plan === "personal")
            ) {
              setUpgradeToProScreen("proScreen");
            } else if (userPlan?.plan == "pro") {
              setStartRecordings("startRecordings");
              handleStartRecording();
            } else {
              window.open("https://home.audionotes.app/", "_blank");
            }
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
