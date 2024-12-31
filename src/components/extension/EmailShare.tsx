import { ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

const EmailShare = ({ setSendMail }: any) => {
  const [email, setEmail] = useState("");
  return (
    <div className="p-4 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="rounded-full absolute left-0">
          <div
            onClick={() => setSendMail("")}
            className="bg-plain rounded-full p-1 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 text-subheading" />
          </div>
        </div>
        <h2 className="text-base font-semibold">Send Mail</h2>
      </div>

      <p className="text-sm font-medium text-active text-center">
        Enter the recipients mail address to send
      </p>

      <div>
        <div className="relative mb-4 space-y-2">
          <Input
            type="text"
            placeholder="Enter Email Address"
            className="w-full px-4 py-5 rounded-full text-gray-600 placeholder:text-sm"
          />

          <Input
            type="text"
            placeholder="Subject"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-5 rounded-full text-gray-600 placeholder:text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-heading text-base font-medium pl-2">Include</p>
        <div className="flex gap-2">
          <RadioGroup
            defaultValue="option-one"
            className="flex bg-plain rounded-full p-2"
          >
            <div className="flex items-center space-x-2 border-[1px] border-primary rounded-full p-2 bg-primary-background">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Option One</Label>
            </div>
            <div className="flex items-center space-x-2  border-[1px] border-primary rounded-full p-2 bg-primary-background">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Option Two</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div>
        <Textarea placeholder="Message :" rows={5} className="rounded-2xl" />
      </div>
      <div>
        <Button variant={"secondary"} className="w-full rounded-full py-6">
          Send
        </Button>
      </div>
    </div>
  );
};

export default EmailShare;
