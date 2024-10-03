"use client";
import React from "react";
import Link from 'next/link';
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/modetoggle";
const NavBar: React.FC = () => {
  return (
    <header className="py-5 flex justify-between px-6 backdrop-blur-xl dark:bg-zinc-900/40">
      <Link href="/">
        <h1 className="text-2xl font-semibold cursor-pointer">5ify AI</h1>
      </Link>
      <div>
        <ModeToggle />
      </div>
    </header>
  );
};

export default NavBar;
