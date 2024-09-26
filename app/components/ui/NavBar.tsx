"use client"
import React from 'react';
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/modetoggle"
const NavBar: React.FC = () => {
    return (
        <header className="py-5 flex justify-between border-b px-6">
            <h1 className="text-2xl font-semibold">5ify AI</h1>
            <div><ModeToggle/></div>
        </header>
    );
};

export default NavBar;
