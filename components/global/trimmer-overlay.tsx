import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";

function TrimmerOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const overlayElement = document.getElementById("trimmer-overlay");
      if (overlayElement && !overlayElement.contains(event.target as Node)) {
        onClose();
      }
    };

    const disableScroll = (event: Event) => {
      event.preventDefault();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("wheel", disableScroll, { passive: false });
    document.addEventListener("touchmove", disableScroll, { passive: false });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("wheel", disableScroll);
      document.removeEventListener("touchmove", disableScroll);
    };
  }, [onClose]);

  return (
    <div
      id="trimmer-overlay"
      className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50"
    >
      <LoaderCircle className="text-black animate-spin mb-4" size={40} />
      <p className="text-black text-lg">Processing your video</p>
      <p className="text-gray-500 text-sm">
        Please be patient as this process may take some time
      </p>
    </div>
  );
}

export default TrimmerOverlay;
