import { Video } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

const InviteLanding = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 p-8 space-y-10 mt-20  3xl:mt-0">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Every Great Event Deserves a Story.
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Record or buy a stunning video invitation that celebrates your cause,
          your event, your milestone — beautifully.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Recording Card */}
        <div className="w-full md:w-80">
          <Image
            unoptimized
            width={100}
            height={100}
            src="/record.png"
            alt=""
            className="w-full h-full object-cover rounded-md mb-4"
          />
        </div>

        {/* Designer Template Card */}
        <div className="w-full md:w-80 flex flex-col items-center p-4 rounded-lg border shadow-md bg-white">
          <Image
            unoptimized
            width={100}
            height={100}
            src="/join.png" // Replace with your template preview
            alt="Template Preview"
            className="w-full h-full object-cover rounded-md mb-4"
          />
          <p className="text-sm text-gray-500 text-center">
            Professionally crafted by top video creators
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button
          href="/record"
          className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-semibold h-12"
        >
          <Video className="w-6 h-6" />
          Record Your Invite
        </Button>

        <Button
          href="https://urnotinvited.com/"
          className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold h-12"
        >
          Browse Designer Templates
        </Button>
      </div>
    </div>
  );
};

export default InviteLanding;
