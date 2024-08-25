"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      {theme === "dark" ? (
        <Sun
          onClick={() => {
            console.log("light theme");
            setTheme("light");
          }}
          className="cursor-pointer text-foreground mr-2 w-4 group-hover:rotate-180 transition-all duration-300 ease-in-out"
        />
      ) : (
        <Moon
          onClick={() => setTheme("dark")}
          className="cursor-pointer mr-2 w-4 group-hover:rotate-180 transition-all duration-300 ease-in-out"
        />
      )}
    </div>
  );
}
