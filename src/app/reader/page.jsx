"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/dark-toggle";
import { Input } from "@/components/ui/input";
import { SettingsIcon } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Read() {
  const [articleUrl, setArticleUrl] = useState("");
  return (
    <>
      <header className="p-2 pl-4 pr-4 flex justify-between gap-4 items-center select-none absolute left-0 right-0 top-0 z-10">
        <div className="flex gap-4 items-center">
          <Link href="/" className="text-black dark:text-white">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          <ModeToggle />
          <Link href="/settings" className="text-black dark:text-white">
            <Button variant="outline" size="icon">
              <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </Link>
        </div>
      </header>
      <div className="p-8 fixed inset-0 flex justify-center items-center z-5">
        <article className="w-[600px]">
          <section className="hero">
            <h1>The best way to read articles online</h1>
            <p>
              Feedbomb Reader is a modern, distraction-free reading experience
              for the modern web. Blocks ads, pop-ups, distractions, and more.
            </p>
            <br />
            <div className="flex gap-4">
              <Input
                placeholder="Article URL"
                value={articleUrl}
                onChange={(e) => setArticleUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key == "Enter" && articleUrl.length > 0) {
                    window.location.href = `/read/${btoa(articleUrl).replaceAll(
                      "/",
                      "-"
                    )}`;
                  }
                }}
              />
              <Link
                href={`/read/${btoa(articleUrl).replaceAll("/", "-")}`}
                className={
                  articleUrl.length == 0
                    ? "pointer-events-none cursor-default"
                    : ""
                }
              >
                <Button disabled={articleUrl.length == 0}>Read</Button>
              </Link>
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
