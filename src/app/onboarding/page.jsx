"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function App() {
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const [step, setStep] = useState(0);
  let feeds = [
    {
      url: "https://www.nytimes.com/services/xml/rss/nyt/HomePage.xml",
      title: "New York Times",
      visitURL: "https://www.nytimes.com",
      checked: false,
    },
    {
      url: "https://feeds.bbci.co.uk/news/world/rss.xml",
      title: "BBC World News",
      visitURL: "https://www.bbc.com",
    },
    {
      url: "https://news.ycombinator.com/rss",
      title: "Hacker News",
      visitURL: "https://news.ycombinator.com",
    },
    {
      url: "https://lifehacker.com/feed/rss",
      title: "Life Hacker",
      visitURL: "https://lifehacker.com",
    },
    {
      url: "http://www.espn.com/espn/rss/news",
      title: "ESPN",
      visitURL: "https://www.espn.com",
    },
    {
      url: "http://feeds2.feedburner.com/businessinsider",
      title: "Business Insider",
      visitURL: "https://www.businessinsider.com",
    },
    {
      url: "https://theverge.com/rss/index.xml",
      title: "The Verge",
      visitURL: "https://www.theverge.com",
    },
    {
      url: "https://techcrunch.com/feed/",
      title: "Tech Crunch",
      visitURL: "https://techcrunch.com",
    },
    {
      url: "https://feeds.arstechnica.com/arstechnica/index",
      title: "Ars Technica",
      visitURL: "https://arstechnica.com",
    },
    {
      url: "https://www.vox.com/rss/index.xml",
      title: "Vox",
      visitURL: "https://www.vox.com",
    },
  ];
  feeds = shuffleArray(feeds);
  const [selections, setSelections] = useState(feeds);

  function finishOnboarding() {
    let generatedFeeds = [];
    for (let i = 0; i < selections.length; i++) {
      if (selections[i].checked) {
        generatedFeeds.push(selections[i].url);
      }
    }
    localStorage.setItem("onboardingCompleted", "true");
    localStorage.setItem("savedFeeds", JSON.stringify(generatedFeeds));
    window.location.href = "/";
  }

  function FirstScreen() {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="gap-4 px-8 py-8 max-w-[600px] text-left">
          <h1 className="text-4xl font-bold mb-3">Welcome to Feedbomb</h1>
          <p className="text-lg text-gray-300">
            Feedbomb is a tool to help you keep all your feeds organized, so you
            can stay up-to-date with the latest news and information.
          </p>
          <br />
          <Button onClick={() => setStep(1)}>Get started</Button>
        </div>
      </div>
    );
  }

  function SecondScreen() {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="gap-4 px-8 py-8 max-w-[600px] text-left">
          <h1 className="text-4xl font-bold mb-3">
            Pick some feeds to get started
          </h1>
          <p className="text-lg text-gray-300">These feeds have been curated</p>
          <br />
          <ul className="grid grid-cols-1 gap-4 mb-4">
            {selections.map((feed, index) => (
              <div key={index} className="flex gap-4 items-center">
                <Checkbox
                  onClick={() => {
                    const newSelections = selections;
                    newSelections[index].checked =
                      !newSelections[index].checked;
                    setSelections(newSelections);
                  }}
                  id={index}
                />
                <label htmlFor={index} className="select-none">
                  {feed.title} <a href={feed.visitURL}>(visit)</a>
                </label>
              </div>
            ))}
          </ul>
          <br />
          <Button onClick={() => finishOnboarding()}>Start reading</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {step == 0 ? <FirstScreen /> : <SecondScreen />}
    </div>
  );
}
