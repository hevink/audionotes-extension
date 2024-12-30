import { Download, LoaderCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import RightArrowIcon from "../../assets/icons/RightArrowIcon";
import PauseIcon from "../../assets/icons/PauseIcon";
import RecordIcon from "../../assets/icons/RecordIcon";
import { useState } from "react";

const RecordAudio = () => {
    const [isRecording, setIsRecording] = useState(true);
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
            <div className="h-56 bg-red-100"></div>
            <div className="font-semibold text-2xl leading-5 text-center mt-5">
                00:00 / 30:00
            </div>
            <div className="mt-12 px-5">
                {isRecording ? (
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col items-center">
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
                            onClick={() => setIsRecording(false)}
                        >
                            <RecordIcon />
                            Stop recording
                        </Button>
                        <div className="flex flex-col items-center">
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
                        <Button variant={"secondary"} size="lg" className="gap-1.5 w-full">
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
