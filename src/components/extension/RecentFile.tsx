import React, { useEffect } from "react";
import { Button } from "../ui/button";
import RecordIcon from "../../assets/icons/RecordIcon";
import RecentFileItem from "./RecentFileItem";
import { useGetInitialNotes, useGetUserPlan } from "../../queries";
import { Loader2 } from "lucide-react";
import { queryClient } from "../../provider";
import supabase from "../../lib/supabase/client";

type RecentFileProps = {
  setSendMail: (value: string) => void;
  handleStartRecording: () => void;
  setStartRecordings: (value: string) => void;
  isAuthentications: boolean;
  setUpgradeToProScreen: (value: string) => void;
  storedLoginState: string | null;
};

const RecentFile: React.FC<RecentFileProps> = ({
  setSendMail,
  handleStartRecording,
  setStartRecordings,
  isAuthentications,
  setUpgradeToProScreen,
  storedLoginState,
}) => {
  const { data: notes = [], isLoading: isNotesLoading } = useGetInitialNotes();
  const { data: userPlan } = useGetUserPlan() as any;

  const [newNotes, setNewNotes] = React.useState<any[]>([]);

  console.log("newNotes", newNotes);

  useEffect(() => {
    const channel = supabase.channel("notes-changes");

    const handleInsertOrUpdate = (payload: any) => {
      queryClient.setQueryData(["notes", payload.new.id], payload.new);

      queryClient.setQueryData(["all_notes"], (oldNotes: any) => [
        payload.new,
        ...(oldNotes || []),
      ]);

      // Add or replace note if is_ready is "yes"
      if (payload.new.is_ready === "yes") {
        setNewNotes((prevNotes) => {
          const noteExists = prevNotes.some(
            (note) => note.id === payload.new.id
          );
          if (noteExists) {
            // Replace the existing note with the new one
            return prevNotes.map((note) =>
              note.id === payload.new.id ? payload.new : note
            );
          }
          // Add the new note to the beginning if it's not already present
          return [payload.new, ...prevNotes];
        });
      }

      console.log("payload.new", payload.new);

      if (
        payload.new.is_ready === "error" &&
        payload.new.title === "Oops! Video Too Long 😕"
      ) {
        console.log("Error detected");
      }
    };

    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notes" },
      handleInsertOrUpdate
    );

    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "notes" },
      handleInsertOrUpdate
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
      console.debug("Unsubscribed from notes-changes channel");
    };
  }, []);

  // 🛡️ Ensure no duplicate IDs in notes
  const filteredNotes = notes.filter(
    (note: any) => !newNotes.some((newNote) => newNote.id === note.id)
  );

  const allNotes = [...newNotes, ...filteredNotes];

  return (
    <div className="space-y-2 px-5 py-4">
      {isNotesLoading ? (
        <div className="h-[272px] flex items-center justify-center">
          <Loader2 className="h-8 animate-spin text-primary" />
        </div>
      ) : allNotes.length > 0 ? (
        allNotes.map((note, index) => (
          <RecentFileItem
            key={note.id}
            note={note}
            setSendMail={setSendMail}
            isLast={index === allNotes.length - 1}
          />
        ))
      ) : (
        <div className="h-[272px] flex flex-col items-center justify-center">
          <p className="text-xl font-semibold">Welcome to Audionotes!</p>
          <p className="text-lg text-center font-medium text-subheading mt-3 max-w-80">
            Hit the <span className="text-primary">Start recording</span> button
            to record your first audio note.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Button
          className="w-full rounded-full font-semibold text-[15px] py-6"
          variant="plain"
          onClick={() => window.open("https://home.audionotes.app/", "_blank")}
        >
          View More
        </Button>
        <Button
          size="lg"
          className="flex items-center font-medium text-base leading-5 w-full"
          variant="primary"
          onClick={() => {
            if (isAuthentications) {
              if (storedLoginState === "true" && userPlan?.plan !== "pro") {
                setUpgradeToProScreen("proScreen");
              } else if (
                storedLoginState === "false" &&
                (userPlan?.plan === "free" || userPlan?.plan === "personal")
              ) {
                setStartRecordings("startRecordings");
                handleStartRecording();
              } else if (
                storedLoginState === "false" &&
                userPlan?.plan === "pro"
              ) {
                setStartRecordings("startRecordings");
                handleStartRecording();
              } else {
                window.open("https://home.audionotes.app/", "_blank");
              }
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
