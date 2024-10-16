"use client";

import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/ui/cmd";
import { ModeToggle } from "@/components/ui/dark-toggle";
import { ChevronLeft } from "lucide-react";
import { SettingsIcon } from "lucide-react";

let data = {
  tech: [
    { url: "https://techcrunch.com/feed", title: "TechCrunch" },
    { url: "https://www.wired.com/feed/rss", title: "Wired" },
    { url: "https://www.theverge.com/rss/index.xml", title: "The Verge" },
    { url: "https://www.engadget.com/rss.xml", title: "Engadget" },
    {
      url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
      title: "New York Times Technology",
    },
    { url: "https://www.cnet.com/rss/news/", title: "CNET News" },
    {
      url: "https://feeds.arstechnica.com/arstechnica/index",
      title: "Ars Technica",
    },
    { url: "https://www.zdnet.com/news/rss.xml", title: "ZDNet" },
    { url: "https://www.techmeme.com/feed.xml", title: "Techmeme" },
  ],
  us_news: [
    {
      url: "https://rss.nytimes.com/services/xml/rss/nyt/US.xml",
      title: "New York Times U.S.",
    },
    {
      url: "https://feeds.washingtonpost.com/rss/national",
      title: "Washington Post National",
    },
    { url: "https://www.npr.org/rss/rss.php?id=1003", title: "NPR U.S." },
    {
      url: "http://feeds.foxnews.com/foxnews/national",
      title: "Fox News U.S.",
    },
    {
      url: "https://abcnews.go.com/abcnews/usheadlines",
      title: "ABC News U.S.",
    },
    {
      url: "https://www.latimes.com/local/rss2.0.xml",
      title: "Los Angeles Times Local",
    },
    { url: "https://www.cbsnews.com/latest/rss/us", title: "CBS News U.S." },
  ],
  world_news: [
    {
      url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
      title: "New York Times World",
    },
    { url: "https://feeds.bbci.co.uk/news/world/rss.xml", title: "BBC World" },
    { url: "https://www.aljazeera.com/xml/rss/all.xml", title: "Al Jazeera" },
    {
      url: "https://www.theguardian.com/world/rss",
      title: "The Guardian World",
    },
    {
      url: "https://rss.csmonitor.com/feeds/all",
      title: "Christian Science Monitor World",
    },
  ],
  sports: [
    { url: "https://www.espn.com/espn/rss/news", title: "ESPN" },
    { url: "https://rss.cbc.ca/lineup/sports.xml", title: "CBC Sports" },
    { url: "https://www.skysports.com/rss/12040", title: "Sky Sports" },
    { url: "https://www.mlb.com/feeds/news/rss.xml", title: "MLB" },
    {
      url: "https://www.uefa.com/rss/uefachampionsleague/rss.xml",
      title: "UEFA",
    },
  ],
  canada_news: [
    { url: "https://rss.cbc.ca/lineup/canada.xml", title: "CBC Canada" },
    {
      url: "https://www.ctvnews.ca/rss/ctvnews-ca-top-stories-public-rss-1.822009",
      title: "CTV News",
    },
    {
      url: "https://www.theglobeandmail.com/arc/outboundfeeds/rss/category/canada/",
      title: "The Globe and Mail Canada",
    },
    {
      url: "https://www.thestar.com/search/?f=rss&t=article&bl=2827101&l=20",
      title: "Toronto Star Canada",
    },
    { url: "https://globalnews.ca/canada/feed/", title: "Global News Canada" },
    {
      url: "https://www.cbc.ca/cmlink/rss-topstories",
      title: "CBC Top Stories",
    },
  ],
  india_news: [
    {
      url: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
      title: "Times of India",
    },
    {
      url: "https://www.hindustantimes.com/feeds/rss/advertorial/rssfeed.xml",
      title: "Hindustan Times India",
    },
    { url: "http://feeds.feedburner.com/NDTV-LatestNews", title: "NDTV India" },
    { url: "https://indianexpress.com/feed/", title: "The Indian Express" },
    {
      url: "https://www.thehindu.com/news/national/?service=rss",
      title: "The Hindu National",
    },
    {
      url: "https://zeenews.india.com/rss/india-national-news.xml",
      title: "Zee News India",
    },
    { url: "https://www.news18.com/rss/india.xml", title: "News18 India" },
    { url: "https://www.livemint.com/rss/news", title: "Mint" },
    {
      url: "https://www.firstpost.com/commonfeeds/v1/mfp/rss/india.xml",
      title: "Firstpost India",
    },
  ],
  uk_news: [
    { url: "https://feeds.bbci.co.uk/news/uk/rss.xml", title: "BBC UK" },
    { url: "https://www.theguardian.com/uk/rss", title: "The Guardian UK" },
    { url: "https://www.telegraph.co.uk/rss.xml", title: "The Telegraph" },
    {
      url: "https://www.independent.co.uk/news/uk/rss",
      title: "The Independent UK",
    },
    { url: "https://www.dailymail.co.uk/home/index.rss", title: "Daily Mail" },
    {
      url: "https://www.mirror.co.uk/news/uk-news/?service=rss",
      title: "Mirror UK",
    },
    { url: "https://www.express.co.uk/posts/rss/1/uk", title: "Express UK" },
    { url: "https://metro.co.uk/news/uk/feed/", title: "Metro UK" },
    {
      url: "https://www.standard.co.uk/news/uk/rss",
      title: "Evening Standard UK",
    },
  ],
  australia_news: [
    {
      url: "https://www.abc.net.au/news/feed/51120/rss.xml",
      title: "ABC News Australia",
    },
    {
      url: "https://www.smh.com.au/rss/national.xml",
      title: "Sydney Morning Herald National",
    },
    {
      url: "https://www.news.com.au/content-feeds/latest-news-national/",
      title: "news.com.au National",
    },
    {
      url: "https://www.theguardian.com/australia-news/rss",
      title: "The Guardian Australia",
    },
    { url: "https://www.sbs.com.au/news/feed", title: "SBS News" },
    { url: "https://www.9news.com.au/rss", title: "9News" },
    {
      url: "https://www.theage.com.au/rss/national.xml",
      title: "The Age National",
    },
    { url: "https://www.perthnow.com.au/news/feed", title: "PerthNow" },
  ],
  business: [
    { url: "https://feeds.bloomberg.com/markets/news.rss", title: "Bloomberg" },
    { url: "https://www.ft.com/rss/home", title: "Financial Times" },
    {
      url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
      title: "New York Times Business",
    },
    {
      url: "https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml",
      title: "Wall Street Journal Business",
    },
    {
      url: "https://www.cnbc.com/id/10001147/device/rss/rss.html",
      title: "CNBC",
    },
    {
      url: "https://www.economist.com/business/rss.xml",
      title: "The Economist Business",
    },
    {
      url: "https://feeds.feedburner.com/businessinsider",
      title: "Business Insider",
    },
    { url: "https://fortune.com/feed", title: "Fortune" },
    { url: "https://www.marketwatch.com/rss/topstories", title: "MarketWatch" },
  ],
};

export default function Discover() {
  return (
    <>
      <header className="p-4 pt-2 flex justify-between gap-4 items-center select-none">
        <div className="flex gap-4 items-center">
          <Button variant="outline" size="icon" onClick={() => history.back()}>
            <ChevronLeft className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <CommandPalette />
          <ModeToggle />
          <a href="/settings" className="text-black dark:text-white">
            <Button variant="outline" size="icon">
              <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </a>
        </div>
      </header>
      <main className="p-4 pt-2">
        <h1>Discover</h1>
        <p>
          Discover new feeds for your Feedbomb. Click any to instantly add to
          your Feedbomb.
        </p>
        <br />
        <div className="feeds">
          {Object.keys(data).map((category) => (
            <div className={category} key={category}>
              {category
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
              <ul>
                {data[category].map((feed, index) => (
                  <li key={index}>
                    <a href={"/addFeed?feedURL=" + feed.url}>{feed.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
