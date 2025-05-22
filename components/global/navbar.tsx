"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAppContext } from "@/lib/context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "./logo";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { FeedbackSheet } from "./feedback-sheet";

export default function Navbar() {
  const { user, logout, event, downloadFile, setOpenFeedback } =
    useAppContext();
  const router = useRouter();
  const { id: urlId } = useParams();
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const videoData = event?.video?.videos[event?.video?.videos?.length - 1];
  const isTrackPage = pathname.includes("track");
  const isEventPage = pathname.includes("event/");
  const eventDetailsPage = pathname.includes("event-details");
  const customizationPage = pathname.includes("customization");
  const additionalFeaturesPage = pathname.includes("additional-features");
  const loginPage = pathname.includes("login");
  const isVideoPreviewPage = pathname.includes("video-preview");

  const paramsId = searchParams.get("id");
  const preview = searchParams.get("preview");
  const id = urlId || paramsId;
  const queryString = searchParams.toString();
  const querySuffix = queryString ? `?${queryString}` : "";
  const isAdmin = user?.role === "admin";
  if ((isEventPage && !preview) || loginPage) {
    return null;
  }

  return (
    <header className="flex flex-col h-max justify-center bg-white  border-b fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between h-16 gap-2 border-b px-4 py-2">
        <Logo />
        <div className="flex items-center gap-2">
          {user?.role ? (
            <UserDropdown user={user} logout={logout} />
          ) : (
            <Button href="/login" variant="special">
              Login
            </Button>
          )}
        </div>
      </div>

      {((id && !isTrackPage) ||
        eventDetailsPage ||
        customizationPage ||
        additionalFeaturesPage) && (
        <>
          {!preview ? (
            <div className="flex h-14 items-center justify-between bg-white px-4 py-2">
              <Link
                href={
                  isAdmin || isVideoPreviewPage
                    ? isAdmin
                      ? "/manage-events"
                      : `/events`
                    : `/video-preview${querySuffix || "?id=" + id}`
                }
                className="flex items-center gap-1 text-base font-semibold text-[#2E333B] hover:text-[#4A61FF]"
              >
                <ChevronLeft className="h-6 w-6" />
                {isAdmin || isVideoPreviewPage
                  ? "Back to Dashboard"
                  : "Back to Video"}
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => downloadFile(videoData?.url, "download")}
                  variant="outline"
                  className="flex items-center gap-2 border-primary text-primary sm:text-sm text-xs px-2 sm:px-4"
                >
                  Download
                </Button>

                <Button
                  onClick={() => setOpenFeedback(true)}
                  variant="outline"
                  className="text-primary border-primary sm:text-sm text-xs px-2 sm:px-4"
                >
                  Suggest Feedback
                </Button>

                <FeedbackSheet />

                <Button
                  href={`/event-details?id=${event?._id}`}
                  className="bg-[#4A61FF] text-white hover:bg-[#4338CA] sm:text-sm text-xs px-2 sm:px-4"
                >
                  Event Details
                </Button>
                <Button
                  href={`/event/${id}?preview=true`}
                  className="bg-[#4A61FF] hover:bg-[#4338CA] px-6"
                >
                  Preview
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="special"
              className="flex items-center gap-2"
              onClick={() => router.back()}
            >
              <ArrowLeft />
              <span>Go Back</span>
            </Button>
          )}
        </>
      )}
    </header>
  );
}

const UserDropdown = ({ user, logout }: { user: any; logout: () => void }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.image} alt="User avatar" />
          <AvatarFallback>
            {user?.name?.charAt(0) || user?.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Link href={user?.role === "admin" ? "/manage-events" : "/events"}>
            Manage Events
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
