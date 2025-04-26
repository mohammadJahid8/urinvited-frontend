import Image from "next/image";
import React from "react";

const InviteLanding = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 p-8 space-y-10">
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
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-semibold">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v2a1 1 0 01-2 0v-8a1 1 0 012 0v2z" />
            <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
          </svg>
          Record Your Invite
        </button>

        <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold">
          Browse Designer Templates
        </button>
      </div>
    </div>
  );
};

export default InviteLanding;
