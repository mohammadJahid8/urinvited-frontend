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

export default function Navbar() {
  const { user, logout } = useAppContext();

  if (!user?.role) {
    return null;
  }

  return (
    <header className="flex h-16 items-center justify-between bg-white px-4 border-b fixed top-0 left-0 w-full z-50">
      <Logo />
      <div className="flex items-center gap-2">
        <UserDropdown user={user} logout={logout} />
      </div>
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
          <Link href="/manage-events">Manage Events</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
