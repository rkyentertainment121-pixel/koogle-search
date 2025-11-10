
'use client';

import { Menu, User, Settings } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import SettingsDialog from "./settings-dialog";
import { useState } from "react";

export default function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open main menu</span>
            </Button>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src="https://picsum.photos/seed/koogle-user/40/40" alt="User" />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Bookmarks</DropdownMenuItem>
                <DropdownMenuItem>History</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsSettingsOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}
