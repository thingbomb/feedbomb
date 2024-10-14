"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function AddFeed() {
  const [loadedData, setLoadedData] = useState(null);
  useEffect(() => {
    const url = new URL(window.location.href);
    const feedURL = url.searchParams.get("feedURL");

    if (feedURL) {
      setLoadedData({
        function: () => {
          const currentFeeds =
            JSON.parse(localStorage.getItem("savedFeeds")) || [];
          currentFeeds.push(feedURL);
          localStorage.setItem("savedFeeds", JSON.stringify(currentFeeds));
          window.location.href = "/";
        },
        feedURL: feedURL,
      });
    } else {
      alert("No feed URL provided.");
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      {loadedData != null ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Add a feed</h1>
          <p className="text-sm">
            Would you like to add feed `{loadedData.feedURL}` to your Feedbomb?
          </p>
          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              Cancel
            </Button>
            <Button onClick={loadedData.function}>Add</Button>
          </div>
        </div>
      ) : (
        <LoaderCircle className="animate-spin" />
      )}
    </div>
  );
}
