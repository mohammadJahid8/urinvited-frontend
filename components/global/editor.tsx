import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const Editor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write something...",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensures the component renders only on the client
  }, []);

  return (
    <>
      {mounted && (
        <ReactQuill
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="custom-quill"
        />
      )}
    </>
  );
};

export default Editor;
