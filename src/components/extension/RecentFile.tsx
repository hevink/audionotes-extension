import React from "react";
import { Button } from "../ui/button";
import RecordIcon from "../../assets/icons/RecordIcon";
import RecentFileItem from "./RecentFileItem";
import { useGetInitialNotes, useGetUserPlan } from "../../queries";
import { Loader2 } from "lucide-react";

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
  const { data: notes = [], isPending: isNotesLoading } = useGetInitialNotes();
  const { data: userPlan } = useGetUserPlan() as any;

  return (
    <div className="space-y-2 px-5 py-4">
      {isNotesLoading ? (
        <div className="h-[272px] flex items-center justify-center">
          <Loader2 className="h-8 animate-spin text-primary" />
        </div>
      ) : notes.length > 0 ? (
        notes.map((note, index) => (
          <RecentFileItem
            key={note.id}
            note={note}
            setSendMail={setSendMail}
            isLast={index === notes.length - 1}
          />
        ))
      ) : (
        <div className="h-[272px] flex flex-col items-center justify-center">
          <p className="text-xl font-semibold">Welcome to Audionotes!</p>
          <p className="text-lg text-center font-medium text-subheading mt-3 max-w-80">
            Hit the <span className="text-primary"> Start recording </span>button to record your first
            audio note
          </p>
        </div>
      )}

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
