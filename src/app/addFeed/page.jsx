"use client";

import { LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function AddFeed() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const feedURL = url.searchParams.get("feedURL");

    if (feedURL) {
      const currentFeeds = JSON.parse(localStorage.getItem("savedFeeds")) || [];
      currentFeeds.push(feedURL);
      localStorage.setItem("savedFeeds", JSON.stringify(currentFeeds));

      window.location.href = "/";
    } else {
      alert("No feed URL provided.");
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <LoaderCircle className="animate-spin" />
    </div>
  );
}
