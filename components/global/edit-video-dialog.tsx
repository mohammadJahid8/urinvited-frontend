"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Dropzone from "./dropzone";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/utils/axiosInstance";
import axios from "axios";
import { ScrollArea } from "../ui/scroll-area";

export function EditVideoDialog({ video, refetch }: any) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [thInfo, setThInfo] = useState(null);

  const handleUpdateVideo = async (event: any) => {
    event.preventDefault();

    if (!videoFile) {
      return toast.error("Please upload a video!", {
        position: "top-center",
      });
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("upload_preset", "event-upload");
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/ddvrxtfbc/video/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const videourl = response?.data?.secure_url;

      const newFormData = new FormData();
      newFormData.append("url", videourl);
      newFormData.append("thumbnail", thumbnail || "");
      newFormData.append("videoId", video._id);

      if (videourl) {
        const promise = await api.patch(`/video/update`, newFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (promise.status === 200) {
          refetch();
          setOpen(false);
          setVideoFile(null);
          setPreview("");
          setLoading(false);
          setFileInfo(null);
          setThumbnail(null);
          setThumbnailPreview("");
          setThInfo(null);
          toast.success(`Video updated successfully!`);
        }
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      return toast.error(
        error.response.data.message || `Something went wrong!`,
        {
          position: "top-center",
        }
      );
    }
  };
  const handleClose = () => {
    setOpen(false);
    setVideoFile(null);
    setPreview("");
    setFileInfo(null);
    setThumbnail(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit Video
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="flex-row items-center justify-between space-y-0 space-x-2 border-b pb-4">
          <DialogTitle>Edit Video</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4 pr-4">
          <div className="space-y-4 pt-4">
            {/* previous video */}
            <p className="text-sm font-medium">Previous Video</p>
            <video
              className="w-80 h-[200px] object-cover rounded-lg"
              poster={video?.videos[video?.videos?.length - 1]?.thumbnail || ""}
              loop
              playsInline
              controls
            >
              <source
                src={video?.videos[video?.videos?.length - 1]?.url}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {/* new video */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Update Video</p>
                <Dropzone
                  loading={loading}
                  onChange={setVideoFile}
                  className="w-full"
                  type="video"
                  setPreview={setPreview}
                  fileInfo={fileInfo}
                  setFileInfo={setFileInfo}
                />

                {preview && (
                  <div className="relative w-full mt-4" key={preview}>
                    <video controls className="w-full h-[200px] rounded-lg">
                      <source src={preview} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
              {/* thumbnail */}
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Update Thumbnail</p>
                <Dropzone
                  loading={loading}
                  onChange={setThumbnail}
                  className="w-full"
                  type="image"
                  setPreview={setThumbnailPreview}
                  fileInfo={thInfo}
                  setFileInfo={setThInfo}
                />

                {thumbnailPreview && (
                  <div className="relative w-full mt-4">
                    <img
                      src={thumbnailPreview}
                      alt="thumbnail"
                      className="w-full h-[200px] object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                className="w-max"
                onClick={handleClose}
              >
                Cancel
              </Button>

              <Button
                onClick={handleUpdateVideo}
                className="w-max"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Video"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
