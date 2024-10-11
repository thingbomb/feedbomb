"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Read() {
  const [articleUrl, setArticleUrl] = useState("");
  return (
    <div className="p-8 fixed inset-0 flex justify-center items-center">
      <article className="w-[600px]">
        <section className="hero">
          <h1>The best way to read articles online</h1>
          <p>
            Feedbomb Reader is a modern, distraction-free reading experience for
            the modern web. Blocks ads, pop-ups, distractions, and more.
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
            <a
              href={`/read/${btoa(articleUrl).replaceAll("/", "-")}`}
              className={
                articleUrl.length == 0
                  ? "pointer-events-none cursor-default"
                  : ""
              }
            >
              <Button disabled={articleUrl.length == 0}>Read</Button>
            </a>
          </div>
        </section>
      </article>
    </div>
  );
}
