//
import { useCallback, useEffect, useState } from "react";
import { Download, LoaderCircle, Play, X } from "lucide-react";
import * as tus from "tus-js-client";
import { LiveAudioVisualizer } from "react-audio-visualize";
// Components ...
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
// Icons ...
import RightArrowIcon from "../../assets/icons/RightArrowIcon";
import PauseIcon from "../../assets/icons/PauseIcon";
import RecordIcon from "../../assets/icons/RecordIcon";
// APIs ...
import supabase from "../../lib/supabase/client";
import { createNote, useGetUserPlan } from "../../queries";
// Helper functions ...
import { randomBytes } from "../../helper/makeUrl";
import { formatTime } from "../../lib/utils";
import { LeftArrowIcon } from "../../assets/icons/LeftArrowIcon";

interface RecorderProps {
  stopRecording: () => void;
  recordingTime: number;
  recordingBlob?: Blob;
  mediaRecorder?: MediaRecorder;
  togglePauseResume: () => void;
  isRecordingAllow: boolean;
  recordingStopped: boolean;
  setRecordingStopped: (value: boolean) => void;
  setRecordingStarted: (value: boolean) => void;
  handleStopRecording: () => void;
  handlePending: (type: "audio", value: boolean) => void;
  setActiveTab: (tab: "audio" | "files") => void;
  setStartRecordings: (recording: string) => void;
  isAudioPending: boolean;
  setUpgradePlan: (upgradePlan: string) => void;
  setUpgradeToProScreen: (upgradePlan: string) => void;
  isPaused: boolean;
  setIsCancelled: (value: boolean) => void;
  isCancelled: boolean;
  setIsRecordingAllow: (value: boolean) => void;
}

const RecordAudio = ({
  stopRecording,
  recordingTime,
  recordingBlob,
  mediaRecorder,
  togglePauseResume,
  isRecordingAllow,
  recordingStopped,
  setRecordingStopped,
  setRecordingStarted,
  handleStopRecording,
  handlePending,
  setActiveTab,
  setStartRecordings,
  isAudioPending,
  setUpgradePlan,
  setUpgradeToProScreen,
  isPaused,
  setIsCancelled,
  isCancelled,
  setIsRecordingAllow,
}: RecorderProps) => {
  const [recordingBlobState, setRecordingBlobState] = useState<Blob | null>(
    null
  );
  const [status, setStatus] = useState("");
  const [audioUrl, setAudioUrl] = useState<string>();
  const [noteType, setNoteType] = useState<"audio" | "upload" | "text">(
    "audio"
  );
  const [inputText, setInputText] = useState<string>();
  const [youtubeUrl, setYoutubeUrl] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [accessToken, setAccessToken] = useState<string | undefined>("");
  const [shouldProcessRecording, setShouldProcessRecording] = useState(false);

  const { data: plan } = useGetUserPlan() as any;

  const user = async () => {
    const { data } = await supabase.auth.getSession();
    setAccessToken(data?.session?.access_token);
    return data;
  };

  const handleFileUpload = useCallback(
    async (blob: Blob | File, type: "image" | "audio") => {
      try {
        if (!blob) {
          throw new Error(
            type === "audio"
              ? "Please select or record an audio"
              : "Please select an image"
          );
        }

        // Get fresh session before upload
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          throw new Error("Authentication required");
        }

        let key =
          type === "image" ? `image_${randomBytes(20)}` : randomBytes(20);

        if (blob.type.includes("webm")) {
          key = `${key}.webm`;
        } else if (blob.type.includes("mp4")) {
          key = `${key}.mp4`;
        }

        return new Promise<void>((resolve, reject) => {
          const upload = new tus.Upload(blob, {
            endpoint: `${
              import.meta.env.VITE_SUPABASE_URL
            }/storage/v1/upload/resumable`,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: {
              authorization: `Bearer ${session.access_token}`,
              "x-upsert": "true",
            },
            uploadDataDuringCreation: true,
            removeFingerprintOnSuccess: true,
            metadata: {
              bucketName: import.meta.env.VITE_SUPABASE_BUCKET!,
              objectName: key,
              contentType: blob.type,
              cacheControl: "3600",
            },
            chunkSize: 6 * 1024 * 1024,
            onError: (error) => {
              console.error("Failed because: " + error);
              reject(error);
            },
            onProgress: (bytesUploaded, bytesTotal) => {
              const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(
                2
              );
              setStatus(`Uploading ${percentage}%`);
            },
            onSuccess: () => {
              const publicUrl = `${
                import.meta.env.VITE_SUPABASE_URL
              }/storage/v1/object/public/audionotes_app/${key}`;
              setAudioUrl(publicUrl);
              setStatus("Generating notes...");
              resolve();
            },
          });

          upload.findPreviousUploads().then((previousUploads) => {
            if (previousUploads.length) {
              upload.resumeFromPreviousUpload(previousUploads[0]);
            }
            upload.start();
          });
        });
      } catch (err) {
        handlePending("audio", false);
        setStatus("Generation failed");
        console.log(err, "err");
      }
    },
    [handlePending]
  );

  const handleDownloadAudio = useCallback(() => {
    if (recordingBlobState) {
      const url = URL.createObjectURL(recordingBlobState);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `recording-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }, [recordingBlobState]);

  const handleCancelRecording = useCallback(() => {
    setIsCancelled(true);
    stopRecording();
    setRecordingStopped(true);
    setRecordingBlobState(null);
    setShouldProcessRecording(false);
  }, [stopRecording, setIsCancelled, setRecordingStopped]);

  const sendNoteToAPI = useCallback(async () => {
    if (!accessToken || !shouldProcessRecording) {
      return;
    }

    if (noteType === "audio" && !audioUrl) {
      return;
    }

    if (noteType === "text" && !inputText) {
      return;
    }

    const { error } = await createNote({
      noteType,
      audioUrl,
      youtubeUrl,
      imageUrl,
      text: inputText,
      audioFilename: audioUrl?.split("/").pop() || "",
      device: navigator?.userAgent ?? "Web",
      accessToken,
    });

    // Reset states based on plan type
    if (plan?.plan === "pro") {
      setActiveTab("files");
      setStartRecordings("");
    } else if (plan?.plan === "free") {
      setUpgradePlan("upgradePlan");
      setStartRecordings("");
    } else if (plan?.plan === "personal") {
      setUpgradeToProScreen("proScreen");
      setStartRecordings("");
    }

    // Reset all recording states
    setRecordingStopped(true);
    setIsRecordingAllow(true);
    setRecordingBlobState(null);
    setRecordingStarted(false);
    setIsCancelled(true);
    handlePending("audio", false);
    setNoteType("audio");
    setAudioUrl(undefined);
    setYoutubeUrl(undefined);
    setInputText(undefined);
    setImageUrl(undefined);
    setStatus("");
    setShouldProcessRecording(false);

    if (error) {
      console.error("Error sending note to API:", error);
    }
  }, [
    noteType,
    audioUrl,
    youtubeUrl,
    imageUrl,
    inputText,
    accessToken,
    shouldProcessRecording,
    plan,
  ]);

  // Modified stop recording handler
  const handleStopRecordingAndProcess = useCallback(() => {
    if (!recordingStopped) {
      handleStopRecording();
      setShouldProcessRecording(true);
    } else {
      handleStopRecording();
      setShouldProcessRecording(false);
    }
  }, [recordingStopped, handleStopRecording]);

  useEffect(() => {
    if (audioUrl && shouldProcessRecording) {
      sendNoteToAPI();
    }
  }, [audioUrl, shouldProcessRecording]);

  // Update recording blob only when recording is stopped
  useEffect(() => {
    if (recordingBlob && !isCancelled && recordingStopped) {
      setRecordingBlobState(recordingBlob);
    }
  }, [recordingBlob, isCancelled, recordingStopped]);

  useEffect(() => {
    if (recordingBlobState && shouldProcessRecording && !isCancelled) {
      handlePending("audio", true);
      handleFileUpload(recordingBlobState, "audio");
    }
  }, [recordingBlobState, shouldProcessRecording, isCancelled]);

  useEffect(() => {
    user();
  }, [accessToken]);

  return (
    <div className="p-5">
      <div className="relative flex items-center justify-center mb-3">
        <div className="rounded-full absolute left-0">
          <div
            onClick={() => {
              setStartRecordings("");
              setActiveTab("files");
            }}
            className="bg-plain rounded-full p-0.5 cursor-pointer"
          >
            <LeftArrowIcon />
          </div>
        </div>
        <p className="text-foreground font-semibold text-base text-center leading-5 flex items-center">
          Recording Audio
        </p>
      </div>

      <div
        onClick={() => window.open("https://home.audionotes.app/", "_blank")}
        className="flex items-center justify-center mb-8"
      >
        <Badge
          variant="primary"
          className="rounded-full font-semibold text-sm leading-4 py-1.5 px-2.5 gap-1 cursor-pointer"
        >
          Upgrade to get more minutes
          <RightArrowIcon />
        </Badge>
      </div>
      <div className="h-[242px] flex items-center justify-center">
        {mediaRecorder && (
          <div className="flex justify-center items-center">
            <LiveAudioVisualizer
              mediaRecorder={mediaRecorder}
              width={340}
              height={50}
              barWidth={3}
              gap={4}
              fftSize={512}
              maxDecibels={-10}
              minDecibels={-80}
              smoothingTimeConstant={0.8}
              barColor="#C8C8C8"
            />
          </div>
        )}
      </div>
      <div className="font-semibold text-2xl leading-5 text-center mt-5">
        {formatTime(recordingTime, (plan?.recording_time ?? 60) >= 3600)} /{" "}
        {formatTime(
          plan?.recording_time || 60,
          (plan?.recording_time ?? 60) >= 3600
        )}
      </div>
      <div className="mt-12 px-5">
        {isRecordingAllow ? (
          <div className="flex items-center justify-between">
            <div
              onClick={handleCancelRecording}
              className="flex flex-col items-center"
            >
              <div className="p-2 border rounded-full cursor-pointer relative">
                <X className="text-subheading size-5" />
              </div>
              <p className="mt-5 font-medium text-sm leading-4 text-heading absolute bottom-7 left-[39px]">
                Cancel
              </p>
            </div>
            <Button
              size={"lg"}
              className="flex items-center gap-1 font-medium text-base leading-5 py-5"
              variant={"primary"}
              onClick={handleStopRecordingAndProcess}
            >
              <RecordIcon />
              {recordingStopped ? "Start recording" : "Stop recording"}
            </Button>
            <div
              onClick={() => togglePauseResume()}
              className="flex flex-col items-center "
            >
              {isPaused ? (
                <div className="p-2 border rounded-full cursor-pointer">
                  <Play
                    fill="#A0A0A0"
                    className="h-5 w-5 text-subheading relative"
                  />
                </div>
              ) : (
                <div className="p-2 border rounded-full cursor-pointer relative">
                  <PauseIcon />
                </div>
              )}
              <p className="mt-5 font-medium text-sm leading-4 text-heading max-w-[40px]  absolute bottom-7 right-[39px]">
                {isPaused ? "Resume" : "Pause"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {isAudioPending && (
              <Button variant="transparent" size="lg" className="gap-1.5">
                <LoaderCircle className="animate-spin size-4" />
                {status}
              </Button>
            )}
            <Button
              onClick={() => handleDownloadAudio()}
              variant={"secondary"}
              size="lg"
              className="gap-1.5 w-full"
            >
              <Download className="size-4" />
              Download Audio
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordAudio;
