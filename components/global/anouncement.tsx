"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BellRing, Mail } from "lucide-react";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export function Anouncement() {
  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const promise = api.post(`/event/send-anouncement`, {
        eventId: id,
        subject,
        description,
      });
      toast.promise(promise, {
        loading: "Sending anouncement...",
        success: () => {
          setLoading(false);
          setOpen(false);
          setSubject("");
          setDescription("");
          return "Anouncement sent successfully";
        },
        error: "Anouncement sending failed",
        position: "top-center",
      });
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      setOpen(false);

      return toast.error(
        error?.response?.data?.message || `Anouncement sending failed`,
        {
          position: "top-center",
        }
      );
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <BellRing className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Anouncement</DialogTitle>
          <DialogDescription>
            Fill in the details for your anouncement.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your message details here..."
              rows={5}
              required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Anouncement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
