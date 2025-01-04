// New Component: RecentFileItem
import React, { useCallback, useRef, useState } from "react";
import { AlertCircle, Loader2, Pause, Play, Send } from "lucide-react";
import { cn, getDateTime, truncateText } from "../../lib/utils";
import { PartialTypeNote } from "../../lib/types";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

type RecentFileItemProps = {
  note: PartialTypeNote;
  setSendMail: (value: string) => void;
  isLast?: boolean;
};

const RecentFileItem: React.FC<RecentFileItemProps> = ({
  note,
  setSendMail,
  isLast,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const noteDate = new Date(note.created_at || new Date());
  const { date, time } = getDateTime(noteDate);

  const initializeAudio = useCallback(async () => {
    if (!audioRef.current && note.audio_url) {
      try {
        setIsLoading(true);
        const audio = new Audio();

        const handleEnded = () => {
          setIsPlaying(false);
          // onPlayStateChange?.(note.id, false);
        };

        const handleLoadedData = () => {
          setIsLoading(false);
        };

        const handleError = () => {
          setIsPlaying(false);
          setIsLoading(false);
          // errorToast("Error loading audio");
          // onPlayStateChange?.(note.id, false);
        };

        const handlePause = () => {
          setIsPlaying(false);
          // onPlayStateChange?.(note.id, false);
        };

        const handlePlay = () => {
          setIsPlaying(true);
          // onPlayStateChange?.(note.id, true);
        };

        const handleTimeUpdate = () => {
          const audio = audioRef.current;
          if (!audio) return;
        };

        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("loadeddata", handleLoadedData);
        audio.addEventListener("error", handleError);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("timeupdate", handleTimeUpdate);

        audio.src = note.audio_url;
        await audio.load();
        audioRef.current = audio;
      } catch (error) {
        console.error("Error initializing audio:", error);
        setIsLoading(false);
        // errorToast("Error initializing audio");
      }
    }
  }, [note.audio_url, note.id]);

  const togglePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!audioRef.current) {
      await initializeAudio();
    }

    const audio = audioRef.current;
    if (audio) {
      try {
        if (isPlaying) {
          audio.pause();
        } else {
          await audio.play();
        }
      } catch (error) {
        console.error("Error toggling play/pause:", error);
        // errorToast("Failed to play audio. Please try again.");
        setIsPlaying(false);
        // onPlayStateChange?.(note.id, false);
      }
    }
  };

  return (
    <div
      className={cn("space-y-2", !isLast && "border-b border-[#F1F5FA] pb-2")}
    >
      {note.is_ready === "yes" ? (
        <div>
          <div className="flex gap-3">
            <div>
              {(note.note_type === "audio" || note.note_type === "upload") &&
                note.audio_url && (
                  <Button
                    variant="plain"
                    disabled={!note.audio_url}
                    className={cn("rounded-full p-0 h-7 w-7")}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause(e);
                    }}
                  >
                    <div className="flex items-center gap-1  text-sm">
                      {isLoading ? (
                        <Loader2 className="animate-spin size-4 text-primary" />
                      ) : isPlaying ? (
                        <Pause className="size-3" />
                      ) : (
                        <Play className="size-3 fill-heading" />
                      )}
                    </div>
                  </Button>
                )}
            </div>

            <div className="space-y-1">
              <p className="text-heading leading-6 font-medium text-base">
                {truncateText(note.title!)}
              </p>

              <p className="flex items-center space-x-2 text-date text-sm font-medium">
                {date} · {time}
              </p>

              <div className="flex items-center space-x-1.5">
                <div
                  className="px-2 py-1 rounded-full text-heading text-xs leading-5 font-semibold bg-[#F3F3F3] cursor-pointer"
                  onClick={() => {
                    window.open(
                      `https://home.audionotes.app/${note.id}`,
                      "_blank"
                    );
                  }}
                >
                  Transcript
                </div>
                <div
                  className="px-2 py-1 leading-5 rounded-full text-heading text-xs font-semibold bg-[#F3F3F3] cursor-pointer"
                  onClick={() => {
                    window.open(
                      `https://home.audionotes.app/${note.id}`,
                      "_blank"
                    );
                  }}
                >
                  Summary
                </div>
                <div
                  className="flex items-center space-x-1 px-2 py-1 leading-5 rounded-full text-xs text-heading font-semibold whitespace-nowrap bg-[#F3F3F3] cursor-pointer"
                  onClick={() => setSendMail("showDetails")}
                >
                  <Send size={15} />
                  <span>Share via Email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : note.is_ready === "no" ? (
        <div className="flex  gap-2">
          <Skeleton className="size-6" />
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2">
              <Loader2 className="size-5 text-subheading animate-spin" />
              <p className="text-heading leading-6 font-medium text-base animate-pulse">
                AI is generating your notes
              </p>
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-500">
            <div className="bg-plain rounded-full p-1">
              <AlertCircle className="w-5 h-5 text-white" fill="#FF3300" />
            </div>
            <span className="text-heading leading-6 font-medium text-base">
              {note.title ?? "Processing Failed"}
            </span>
          </div>
          <p className="text-date ml-9">
            We're facing a delay. Your audio will be processed soon.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentFileItem;
