//
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Download, LoaderCircle, X } from "lucide-react";
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
import { FormatTime } from "../../helper/formatTime";
import { formatTime } from "../../lib/utils";

interface RecorderProps {
  stopRecording: () => void;
  recordingTime: number;
  recordingBlob?: Blob;
  mediaRecorder?: MediaRecorder;
  togglePauseResume: () => void;
  isRecordingAllow: boolean;
  finalTime: number;
  recordingStopped: boolean;
  setRecordingStopped: (value: boolean) => void;
  setRecordingStarted: (value: boolean) => void;
  handleStopRecording: () => void;
  handlePending: (type: "text" | "audio", value: boolean) => void;
  setActiveTab: (tab: string) => void;
  setStartRecordings: (recording: string) => void;
  isAudioPending: boolean;
  isTextPending: boolean;
}

const RecordAudio = ({
  stopRecording,
  recordingTime,
  recordingBlob,
  mediaRecorder,
  togglePauseResume,
  isRecordingAllow,
  finalTime,
  recordingStopped,
  setRecordingStopped,
  setRecordingStarted,
  handleStopRecording,
  handlePending,
  setActiveTab,
  setStartRecordings,
  isAudioPending,
  isTextPending,
}: RecorderProps) => {
  const [recordingBlobState, setRecordingBlobState] = useState<Blob | null>(
    null
  );
  const [status, setStatus] = useState("");
  const [audioUrl, setAudioUrl] = useState<string>();
  const [noteType, setNoteType] = useState<
    "audio" | "upload" | "text" | "youtube" | "image"
  >("audio");
  const [inputText, setInputText] = useState<string>();
  const [youtubeUrl, setYoutubeUrl] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [accessToken, setAccessToken] = useState<string | undefined>("");
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

        new Promise<void>((resolve, reject) => {
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
            chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
            onError: (error: any) => {
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
          console.log(upload, "upload");

          // Check if there are any previous uploads to continue.
          return upload.findPreviousUploads().then((previousUploads) => {
            // Found previous uploads so we select the first one.
            if (previousUploads.length) {
              upload.resumeFromPreviousUpload(previousUploads[0]);
            }

            // Start the upload
            upload.start();
          });
        });
      } catch (err) {
        handlePending("audio", false);
        setStatus("Generation failed");
        // errorToast(`${err}`);
        console.log(err, "err");
      } finally {
        setStatus("");
      }
    },
    [handlePending]
  );

  // Memoize handleRecording with an extra step to control repetitive calls.
  const stableHandleRecording = useCallback(
    async (blob: Blob) => {
      handlePending("audio", true);
      await handleFileUpload(blob, "audio");
    },
    [handleFileUpload, handlePending]
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
    stopRecording();
    setRecordingStarted(false); // Mark recording as not started
    setRecordingStopped(false); // Reset stopped state
    setRecordingBlobState(null); // Clear blob state
  }, [stopRecording]);

  const sendNoteToAPI = useCallback(async () => {
    if (!accessToken) {
      // errorToast("Authentication error. Please try logging in again.");
      handlePending("audio", false);
      handlePending("text", false);
      return;
    }

    if (
      (noteType === "upload" || noteType === "audio" || noteType == "image") &&
      !audioUrl
    ) {
      return;
    }

    if (noteType === "youtube") {
      setStatus("Processing Youtube video...");
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

    if (error) {
      console.error("Error sending note to API:", error);
    }

    handlePending("audio", false);
    handlePending("text", false);
    setNoteType("audio");
    setAudioUrl(undefined);
    setYoutubeUrl(undefined);
    setInputText(undefined);
    setImageUrl(undefined);
    setRecordingBlobState(null);
    setStatus("");
  }, [
    noteType,
    audioUrl,
    imageUrl,
    youtubeUrl,
    inputText,
    accessToken,
    handlePending,
  ]);

  useEffect(() => {
    sendNoteToAPI();
  }, [audioUrl, inputText, youtubeUrl, sendNoteToAPI]);

  useEffect(() => {
    if (recordingBlob) {
      setRecordingBlobState(recordingBlob);
    }
  }, [recordingBlob]);

  useEffect(() => {
    if (recordingBlobState) {
      handlePending("audio", true);
      stableHandleRecording(recordingBlobState);
    }
  }, [
    recordingBlobState,
    handlePending,
    stableHandleRecording,
    handleFileUpload,
  ]);

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
            className="bg-plain rounded-full p-1 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 text-subheading" />
          </div>
        </div>
        <p className="text-foreground font-semibold text-center leading-5 flex items-center">
          Recording Audio
        </p>
      </div>

      <div className="flex items-center justify-center mb-8">
        <Badge
          variant="primary"
          className="rounded-full font-semibold text-sm leading-4 py-1.5 px-2.5 gap-1"
        >
          Upgrade to get more minutes
          <RightArrowIcon />
        </Badge>
      </div>
      {mediaRecorder && (
        <div className="flex justify-center items-center w-full">
          <LiveAudioVisualizer
            mediaRecorder={mediaRecorder}
            width={280}
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
      <div className="font-semibold text-2xl leading-5 text-center mt-5">
        {formatTime(recordingTime, (plan?.recording_time ?? 60) >= 3600)} /{" "}
        {formatTime(
          plan?.recording_time || 60,
          (plan?.recording_time ?? 60) >= 3600
        )}
      </div>
      <div className="mt-12 px-5">
        {isRecordingAllow ? (
          <div className="flex items-start justify-between">
            <div
              onClick={handleCancelRecording}
              className="flex flex-col items-center"
            >
              <div className="p-2 border rounded-full">
                <X className="text-subheading" />
              </div>
              <p className="mt-5 font-medium text-sm leading-4 text-heading">
                Cancel
              </p>
            </div>
            <Button
              size={"lg"}
              className="flex items-center font-medium text-base leading-5"
              variant={"primary"}
              onClick={handleStopRecording}
            >
              <RecordIcon />
              {recordingStopped ? "Start recording" : "Stop recording"}
            </Button>
            <div
              onClick={() => togglePauseResume()}
              className="flex flex-col items-center"
            >
              <div className="p-2 border rounded-full">
                <PauseIcon />
              </div>
              <p className="mt-5 font-medium text-sm leading-4 text-heading">
                Pause
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {(isAudioPending || isTextPending) && (
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
