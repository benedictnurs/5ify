"use client";
import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { PersonIcon, GitHubLogoIcon, ExitIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/modetoggle";

const NavBar: React.FC = () => {
  const pathname = usePathname(); // Hook to get the current path
  const { isSignedIn } = useUser(); // Get user sign-in status from Clerk

  return (
    <header className="py-5 flex justify-between px-6 backdrop-blur-xl dark:bg-zinc-900/40">
      <Link href="/">
        <h1 className="text-2xl font-semibold cursor-pointer">5ify AI</h1>
      </Link>
      <div className="flex items-center gap-4">
        <ModeToggle />

        <Link href="https://github.com/benedictnurs/5ify" target="_blank">
          <Button variant="ghost" size="icon" >
            <GitHubLogoIcon className="w-5 h-5" />
          </Button>
        </Link>

        {isSignedIn ? (
          <SignOutButton>
            <Button size="icon" variant="ghost">
              <ExitIcon className="w-5 h-5" />
            </Button>
          </SignOutButton>
        ) : (
          pathname === "/" && (
            <Link href="/sign-up">
              <Button size="icon" variant="ghost">
                <PersonIcon className="w-5 h-5" />
              </Button>
            </Link>
          )
        )}
      </div>
    </header>
  );
};

export default NavBar;
