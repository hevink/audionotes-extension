import { ArrowLeft } from "lucide-react";
import {
  MicIcon,
  ImageIcon,
  YoutubeIcon,
  NoteIcon,
  CustomGenerationIcon,
  MindMapIcon,
  WhatsAppIcon,
  NotionIcon,
  ZapierIcon,
  ChatIcon,
  MetaIcon,
  CheckIcon,
} from "../../assets/icons/UpgradePlanIcons";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const plansTitles = [
  {
    icon: <MicIcon />,
    title: "Unlimited Recordings, Text Memos & File Uploads",
    modeType: "5 min",
    proMode: <MetaIcon />,
  },
  {
    icon: <ImageIcon />,
    title: "Unlimited Notes from Images",
    modeType: "-",
    proMode: <CheckIcon />,
  },
  {
    icon: <YoutubeIcon />,
    title: "Unlimited Notes from Youtube videos",
    modeType: "-",
    proMode: <CheckIcon />,
  },
  {
    icon: <NoteIcon />,
    title: "Unlimited Summaries, Meeting Minutes & Lecture Notes",
    modeType: "-",
    proMode: <CheckIcon />,
  },
  {
    icon: <CustomGenerationIcon />,
    title: "Custom generations",
    modeType: "-",
    proMode: <CheckIcon />,
  },
  {
    icon: <MindMapIcon />,
    title: "Mind Maps",
    modeType: "-",
    proMode: <CheckIcon />,
  },
  {
    icon: <WhatsAppIcon />,
    title: "Whatsapp Bot",
    modeType: "-",
    proMode: <CheckIcon />,
  },
  {
    icon: <NotionIcon />,
    title: "Notion Integration",
    modeType: "-",
    proMode: <CheckIcon />,
  },
  {
    icon: <ZapierIcon />,
    title: "Zapier Integration",
    modeType: "-",
    proMode: <CheckIcon />,
  },
  {
    icon: <ChatIcon />,
    title: "Chat with any note",
    modeType: "-",
    proMode: <CheckIcon />,
  },
];

const UpgradePlan = ({ setUpgradePlan }: any) => {
  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="relative flex items-center justify-center">
        <div className="rounded-full absolute left-0">
          <div
            onClick={() => setUpgradePlan("")}
            className="bg-plain rounded-full p-1 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 text-subheading" />
          </div>
        </div>
        <h2 className="text-base font-semibold">Send Mail</h2>
      </div>

      <p className="text-active font-medium text-sm pt-4">
        To upload videos longer than 30 min and other benefits, Upgrade to PRO!
      </p>

      <div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8"></div>
          <div className="col-span-2 text-center font-semibold pb-4 pt-2">
            FREE
          </div>
          <div className="col-span-2 text-center font-semibold text-primary bg-[#FFF0EA] pb-4 pt-2 rounded-t-2xl">
            PRO
          </div>
        </div>
      </div>

      <div className="">
        <div className="col-span-4">
          {plansTitles.map((list, i) => {
            const isLastItem = i === plansTitles.length - 1;
            return (
              <div key={i} className="grid grid-cols-12 gap-4">
                <div className="col-span-8 flex items-center gap-3 pb-2.5">
                  <div className="bg-[#FFF0EA] p-1.5 rounded-xl">
                    {list.icon}
                  </div>
                  <span className="font-semibold text-sm leading-5">
                    {list.title}
                  </span>
                </div>
                <div className="col-span-2 text-center  flex items-center justify-center pb-2.5">
                  {list.modeType}
                </div>
                <div
                  className={cn(
                    "col-span-2 text-center bg-[#FFF0EA] flex items-center justify-center pb-2.5",
                    isLastItem ? "rounded-b-2xl" : ""
                  )}
                >
                  {list.proMode}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        size={"lg"}
        className="flex items-center font-medium text-base mt-3 leading-5 w-full bg-gradient-to-r from-[#FF4D00] to-[#FF2600] text-white"
        variant={"primary"}
      >
        Upgrade to PRO
      </Button>
    </div>
  );
};

export default UpgradePlan;
