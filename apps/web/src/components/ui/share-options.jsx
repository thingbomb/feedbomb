"use client";

import * as React from "react";

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
        {props.variant === "full" ? (
          <Button variant="outline">Share</Button>
        ) : (
          <Button variant="outline" size="icon">
            <ShareIcon className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Share post</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            window.open(
              `mailto:?subject=${encodeURIComponent(
                props.title
              )}&body=${encodeURIComponent(props.url)}`,
              "_blank"
            );
          }}
        >
          Email
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            window.open(`sms:?body=${encodeURIComponent(props.url)}`, "_blank");
          }}
        >
          Messages
        </DropdownMenuItem>
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
              )}&t=${encodeURIComponent(props.title)}`,
              "_blank"
            );
          }}
        >
          Hacker News
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            window.open(
              `https://getpocket.com/edit?url=${props.url}&title=${props.title}`,
              "_blank"
            );
          }}
        >
          Pocket
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(props.url);
          }}
        >
          Copy link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
