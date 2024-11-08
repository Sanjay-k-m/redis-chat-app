"use client";
import React from "react";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";
import { usePreferences } from "@/store/usePreferences";

const PreferencesTab = () => {
  const { setTheme } = useTheme();

  const { soundEnabled, setSoundEnabled } = usePreferences();
  return (
    <div className="flex flex-wrap gap-2 px-1 md:px-2">
      <Button variant="outline" size="icon" onClick={() => setTheme("light")}>
        <SunIcon className="w-[1.2rem] h-[1.2rem] text-muted-foreground" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => setTheme("dark")}>
        <MoonIcon className="w-[1.2rem] h-[1.2rem] text-muted-foreground" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
        {soundEnabled ? (
          <Volume2 className="w-[1.2rem] h-[1.2rem] text-muted-foreground" />
        ) : (
          <VolumeX className="w-[1.2rem] h-[1.2rem] text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};

export default PreferencesTab;
