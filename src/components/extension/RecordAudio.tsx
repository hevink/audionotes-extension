import { useCallback, useEffect, useState } from "react";
import { Download, LoaderCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import RightArrowIcon from "../../assets/icons/RightArrowIcon";
import PauseIcon from "../../assets/icons/PauseIcon";
import RecordIcon from "../../assets/icons/RecordIcon";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { FormatTime } from "../../helper/formatTime";

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
}: any) => {
  const [recordingBlobState, setRecordingBlobState] = useState<Blob | null>(
    null
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

  useEffect(() => {
    if (recordingBlob) {
      setRecordingBlobState(recordingBlob);
    }
  }, [recordingBlob]);

  return (
    <div className="p-5">
      <div className="text-foreground font-semibold text-center leading-5 mb-3">
        Recording Audio
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
        {FormatTime(recordingStopped ? finalTime : recordingTime)} / 30:00
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
            <Button variant="transparent" size="lg" className="gap-1.5">
              <LoaderCircle className="animate-spin size-4" />
              Uploading Audio
            </Button>
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
