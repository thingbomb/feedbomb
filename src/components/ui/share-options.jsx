"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShareIcon } from "lucide-react";

export function ShareOptions(props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <ShareIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Share post</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            window.open(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                props.url
              )}`,
              "_blank"
            );
          }}
        >
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            window.open(
              `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
                props.url
              )}`,
              "_blank"
            );
          }}
        >
          Hacker News
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
