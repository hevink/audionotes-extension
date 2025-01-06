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

  useEffect(() => {
    const channel = supabase.channel("notes-changes");

    const handleInsertOrUpdate = (payload: any) => {
      queryClient.setQueryData(["notes", payload.new.id], payload.new);

      queryClient.setQueryData(["all_notes"], (oldNotes: any) => [
        payload.new,
        ...(oldNotes || []),
      ]);

      // Append the new note to newNotes state if is_ready is "yes"
      if (payload.new.is_ready === "yes") {
        setNewNotes((prevNotes) => {
          // Prevent duplicates
          if (!prevNotes.some((note) => note.id === payload.new.id)) {
            return [...prevNotes, payload.new]; // Append new note
          }
          return prevNotes; // Return existing notes if duplicate
        });
      }

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

  // 🛡️ Ensure no duplicate IDs in notes by combining new and old notes
  const filteredNotes = notes.filter(
    (note: any) => !newNotes.some((newNote) => newNote.id === note.id)
  );

  const allNotes = [...newNotes, ...filteredNotes]

  return (
    <div className="space-y-2 px-5 py-4">
      {isNotesLoading ? (
        <div className="h-[272px] flex items-center justify-center">
          <Loader2 className="h-8 animate-spin text-primary" />
        </div>
      ) : allNotes.length > 0 ? (
        (allNotes.length >= 4
          ? allNotes.filter(note => note.is_ready === "yes").slice(0, 3) // Filter out notes with is_ready !== "yes" if there are 4 or more
          : allNotes
        ).map((note, index) => (
          <RecentFileItem
            key={note.id}
            note={note}
            setSendMail={setSendMail}
            isLast={index === (allNotes.length >= 4 ? 2 : allNotes.length - 1)} // Check if this is the last note in the sliced/filtered array
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
