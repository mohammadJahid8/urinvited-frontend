import React from "react";

const RecordVideo = () => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <img
        src="/placeholder-recording.jpg" // Replace this with your camera feed later
        alt="Recording Placeholder"
        className="w-full h-60 object-cover"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-40">
        <p className="text-white text-lg font-semibold mb-4">
          Capture the moment, Tell your story.
        </p>
        <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700">
          <span className="w-3 h-3 mr-2 rounded-full bg-white"></span> Record
        </button>
      </div>
    </div>
  );
};

export default RecordVideo;
