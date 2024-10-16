import { Settings } from "lucide-react";
import { useEffect } from "react";

const { MagnifyingGlassIcon } = require("@radix-ui/react-icons");
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
const { Sun } = require("lucide-react");
const { Moon } = require("lucide-react");
const { Computer } = require("lucide-react");
const { PlusIcon } = require("lucide-react");
const { BookOpen } = require("lucide-react");
const { useTheme } = require("next-themes");
const { useState } = require("react");

export function CommandPalette({ onAddFeed }) {
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleCommand = (action) => {
    setOpen(false);
    switch (action) {
      case "settings":
        window.location.href = "/settings";
        break;
      case "discover":
        window.location.href = "/discover";
        break;
      case "reader":
        window.location.href = "/reader";
        break;
      case "add-feed":
        onAddFeed();
        break;
      case "light":
        setTheme("light");
        break;
      case "dark":
        setTheme("dark");
        break;
      case "system":
        setTheme("system");
        break;
      default:
        console.log("Unknown action");
    }
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => handleCommand("settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
            <CommandItem onSelect={() => handleCommand("reader")}>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Reader</span>
            </CommandItem>
            <CommandItem onSelect={() => handleCommand("discover")}>
              <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
              <span>Discover</span>
            </CommandItem>
          </CommandGroup>
          {onAddFeed ? (
            <CommandGroup heading="Feeds">
              <CommandItem onSelect={() => handleCommand("add-feed")}>
                <PlusIcon className="mr-2 h-4 w-4" />
                <span>Add feed</span>
              </CommandItem>
            </CommandGroup>
          ) : null}
          <CommandGroup heading="Themes">
            <CommandItem onSelect={() => handleCommand("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => handleCommand("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => handleCommand("system")}>
              <Computer className="mr-2 h-4 w-4" />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
