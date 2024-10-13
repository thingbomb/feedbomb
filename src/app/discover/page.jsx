"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/dark-toggle";
import { Home } from "lucide-react";
import { SettingsIcon } from "lucide-react";

let data = {
  tech: [
    { url: "https://feeds.feedburner.com/TechCrunch", title: "TechCrunch" },
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
    { url: "https://www.computerworld.com/index.rss", title: "Computerworld" },
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
    {
      url: "https://www.nbcnews.com/id/3032091/device/rss/rss.xml",
      title: "NBC News U.S.",
    },
    {
      url: "https://www.usatoday.com/rss/news/nation.xml",
      title: "USA Today Nation",
    },
    { url: "https://www.politico.com/rss/politics.xml", title: "Politico" },
  ],
  world_news: [
    {
      url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
      title: "New York Times World",
    },
    { url: "https://feeds.bbci.co.uk/news/world/rss.xml", title: "BBC World" },
    { url: "https://www.aljazeera.com/xml/rss/all.xml", title: "Al Jazeera" },
    { url: "https://www.reuters.com/rssfeed/world/", title: "Reuters World" },
    {
      url: "https://www.theguardian.com/world/rss",
      title: "The Guardian World",
    },
    {
      url: "https://www.dw.com/en/top-stories/world/s-1429/rss",
      title: "Deutsche Welle World",
    },
    { url: "https://www.france24.com/en/rss", title: "France 24" },
    { url: "https://www3.nhk.or.jp/nhkworld/en/rss/news/", title: "NHK World" },
    {
      url: "https://www.spiegel.de/international/index.rss",
      title: "Der Spiegel International",
    },
    {
      url: "https://www.csmonitor.com/rss/world.rss",
      title: "Christian Science Monitor World",
    },
  ],
  sports: [
    { url: "https://www.espn.com/espn/rss/news", title: "ESPN" },
    { url: "https://rss.cbc.ca/lineup/sports.xml", title: "CBC Sports" },
    { url: "https://www.skysports.com/rss/12040", title: "Sky Sports" },
    {
      url: "https://www.si.com/rss/si_topstories.rss",
      title: "Sports Illustrated",
    },
    { url: "https://www.nba.com/rss/nba_rss.xml", title: "NBA" },
    { url: "https://www.mlb.com/feeds/news/rss.xml", title: "MLB" },
    {
      url: "https://www.nfl.com/rss/rsslanding?newsType=articles",
      title: "NFL",
    },
    { url: "https://www.fifa.com/rss/index.xml", title: "FIFA" },
    { url: "https://www.uefa.com/rssfeed/news/rss.xml", title: "UEFA" },
    { url: "https://www.olympic.org/news/rss", title: "Olympic" },
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
      url: "https://www.thestar.com/content/thestar/feed.RSSManagerServlet.articles.news.canada.rss",
      title: "Toronto Star Canada",
    },
    {
      url: "https://nationalpost.com/category/news/canada/feed",
      title: "National Post Canada",
    },
    {
      url: "https://www.macleans.ca/news/canada/feed/",
      title: "Maclean's Canada",
    },
    {
      url: "https://www.huffingtonpost.ca/feeds/verticals/canada-news/index.xml",
      title: "HuffPost Canada",
    },
    { url: "https://globalnews.ca/canada/feed/", title: "Global News Canada" },
    {
      url: "https://www.cbc.ca/cmlink/rss-topstories",
      title: "CBC Top Stories",
    },
    { url: "https://www.cp24.com/rss/4.739212", title: "CP24" },
  ],
  india_news: [
    {
      url: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
      title: "Times of India",
    },
    {
      url: "https://www.hindustantimes.com/rss/india/rssfeed.xml",
      title: "Hindustan Times India",
    },
    { url: "https://www.ndtv.com/india/feeds", title: "NDTV India" },
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
    {
      url: "https://www.deccanherald.com/rss-internal/top-stories.rss",
      title: "Deccan Herald",
    },
    { url: "https://www.livemint.com/rss/news", title: "Mint" },
    {
      url: "https://www.firstpost.com/rss/india.xml",
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
    {
      url: "https://www.thetimes.co.uk/tto/news/uk/rss",
      title: "The Times UK",
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
    { url: "https://www.theaustralian.com.au/feed/", title: "The Australian" },
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
    { url: "https://www.couriermail.com.au/rss", title: "The Courier-Mail" },
  ],
  business: [
    { url: "https://feeds.bloomberg.com/markets/news.rss", title: "Bloomberg" },
    { url: "https://www.ft.com/rss/home", title: "Financial Times" },
    {
      url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
      title: "New York Times Business",
    },
    {
      url: "https://www.wsj.com/xml/rss/3_7014.xml",
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
    { url: "https://www.forbes.com/business/feed/", title: "Forbes Business" },
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
      <header className="p-4 flex justify-between gap-4 items-center select-none">
        <div className="flex gap-4 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
        <div className="flex gap-2 items-center">
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
