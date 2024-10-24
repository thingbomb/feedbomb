"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/dark-toggle";
import { SettingsIcon, LoaderCircle } from "lucide-react";
import { CommandPalette } from "@/components/ui/cmd";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Parser from "rss-parser";
import DOMPurify from "dompurify";
import { ShareOptions } from "@/components/ui/share-options";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [feedsJSON, setFeedsJSON] = useState([]);
  const [feedsURLs, setFeedsURLs] = useState([]);
  const [newFeedURL, setNewFeedURL] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selector, setSelector] = useState("all_posts");
  const [pwaCardShowing, setPwaCardShowing] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [rules, setRules] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const panelBalance = 60;
  const [selectedArticle, setSelectedArticle] = useState(null);

  const openDialog = () => {
    setDialogOpen(true);
  };

  async function parseRSSFeed(xmlString, url) {
    const parser = new Parser();
    const feed = await parser.parseString(xmlString);
    feed.feedId = feed.link;
    feed.items.forEach((item) => {
      item.feedId = feed.link;
    });
    return feed;
  }

  async function fetchFeeds(urls) {
    try {
      fetch("/api/fetchFeeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls: urls }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          for (let i = 0; i < data.length; i++) {
            let xml = data[i].xml;
            if (xml != null) {
              let feed = await parseRSSFeed(xml, data[i].url);
              setFeeds((prev) => [...prev, feed]);
              setFeedsJSON((prev) => [...prev, feed]);
            }
          }
        });
    } catch (error) {
      console.error("Error fetching or parsing feed:", error);
    }
  }

  function timeDifference(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + " seconds ago";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + " minutes ago";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + " hours ago";
    } else if (elapsed < msPerMonth) {
      return "approximately " + Math.round(elapsed / msPerDay) + " days ago";
    } else if (elapsed < msPerYear) {
      return (
        "approximately " + Math.round(elapsed / msPerMonth) + " months ago"
      );
    } else {
      return "approximately " + Math.round(elapsed / msPerYear) + " years ago";
    }
  }

  const handleAddFeed = () => {
    let validatedFeedURL = newFeedURL.trim();
    if (!validatedFeedURL.startsWith("http")) {
      validatedFeedURL = "https://" + validatedFeedURL;
    }
    if (feedsURLs.includes(validatedFeedURL)) {
      alert("This feed URL already exists.");
      return;
    }
    setFeedsURLs((prev) => {
      const updatedFeeds = [...prev, validatedFeedURL];
      localStorage.setItem("savedFeeds", JSON.stringify(updatedFeeds));
      return updatedFeeds;
    });
    setNewFeedURL("");
    setDialogOpen(false);
    window.location.reload();
  };
  useEffect(() => {
    setRendered(true);
    if (!localStorage.getItem("onboardingCompleted")) {
      window.location.href = "/onboarding";
    }
    const handleBeforeInstallPrompt = (e) => {
      if (localStorage.getItem("pwaCardDismissed") == "true") return;
      e.preventDefault();
      setPwaCardShowing(true);
      setDeferredPrompt(e);
    };
    const savedFeeds = localStorage.getItem("savedFeeds");
    if (savedFeeds) {
      const savedFeedsArray = JSON.parse(savedFeeds);
      setFeedsURLs(savedFeedsArray);
      fetchFeeds(savedFeedsArray);
    } else {
      localStorage.setItem("savedFeeds", JSON.stringify([]));
    }
    const savedRules = localStorage.getItem("filters");
    if (savedRules) {
      const savedRulesArray = JSON.parse(savedRules);
      setRules(savedRulesArray);
    } else {
      localStorage.setItem("filters", JSON.stringify([]));
      setRules([]);
    }
    const toggleSidebar = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "j") {
        e.preventDefault();
        document.querySelector(".main-content").scrollBy(0, 100);
      }
    });
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      setFeedsJSON([]);
      setFeeds([]);

      setFeedsURLs([]);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  function checkArticle(title, author) {
    let isValid = true;

    rules.forEach((rule) => {
      const lowerTitle = title.toLowerCase();
      const lowerValue = rule.value.toLowerCase();
      const lowerAuthor = author.toLowerCase();

      if (rule.rule === "title-contains" && lowerTitle.includes(lowerValue)) {
        isValid = false;
      }

      if (
        rule.rule === "title-starts-with" &&
        lowerTitle.startsWith(lowerValue)
      ) {
        isValid = false;
      }

      if (rule.rule === "title-ends-with" && lowerTitle.endsWith(lowerValue)) {
        isValid = false;
      }

      if (rule.rule === "author-is" && lowerAuthor.includes(lowerValue)) {
        isValid = false;
      }
    });

    return isValid;
  }

  const handleAddToHomeScreen = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the A2HS prompt: ${outcome}`);

    setDeferredPrompt(null);
  };

  const dismissPwaCard = async () => {
    localStorage.setItem("pwaCardDismissed", true);
    setPwaCardShowing(false);
  };

  const allItems = feedsJSON
    .flatMap((feed) => feed.items)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return (
    <SidebarProvider>
      <AppSidebar className="dark:!text-white !text-black">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Feeds</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuButton
                  asChild
                  isActive={selector == "all_posts"}
                  className="select-none cursor-pointer"
                  onClick={() => setSelector("all_posts")}
                >
                  <span>Home</span>
                </SidebarMenuButton>
                {feeds.map((feed, index) => {
                  return (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        asChild
                        isActive={selector == feed.feedId}
                        className="select-none cursor-pointer"
                        onClick={() => setSelector(feed.feedId)}
                      >
                        <span>{feed.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        onClick={() => openDialog()}
                        className="select-none cursor-pointer"
                      >
                        <span>Add feed</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New RSS Feed</DialogTitle>
                      <DialogDescription>
                        Enter the URL of the RSS feed you want to add.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="feedUrl" className="text-right">
                          Feed URL
                        </Label>
                        <Input
                          id="feedUrl"
                          value={newFeedURL}
                          onChange={(e) => setNewFeedURL(e.target.value)}
                          className="col-span-3"
                          placeholder="https://example.com/rss"
                        />
                      </div>
                    </div>
                    <a href="/discover">Discover more feeds</a>
                    <DialogFooter>
                      <Button onClick={handleAddFeed}>Add Feed</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </AppSidebar>

      <main className="grid grid-rows-[50px_calc(100vh_-_50px)] h-full w-full">
        <header className="p-4 flex justify-between gap-4 items-center select-none">
          <div className="flex gap-4 items-center">
            <SidebarTrigger />
          </div>
          <div className="flex gap-2 items-center">
            <CommandPalette onAddFeed={openDialog} />
            <ModeToggle />
            <a href="/settings" className="text-black dark:text-white">
              <Button variant="outline" size="icon">
                <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </a>
          </div>
        </header>
        <main>
          <ResizablePanelGroup direction="horizontal" className="w-full h-full">
            <ResizablePanel defaultSize={100 - panelBalance}>
              <div className="p-4 pt-1 overflow-y-auto custom-scrollbar h-full main-content">
                {allItems.length > 0 ? (
                  <>
                    {pwaCardShowing ? (
                      <div className="p-3">
                        <div
                          className={
                            "bg-[#FFFFFF14] w-full rounded-lg flex justify-between items-center gap-2 p-3"
                          }
                        >
                          <b>Add Feedbomb as a shortcut</b>
                          <div className="flex gap-2">
                            <Button onClick={handleAddToHomeScreen}>
                              Add to Home Screen
                            </Button>
                            <Button variant="outline" onClick={dismissPwaCard}>
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <ul>
                      {allItems
                        .filter((item) => {
                          if (selector == "all_posts") {
                            let check = checkArticle(item.title, item.author);
                            console.log(check);
                            return check;
                          } else {
                            return (
                              item.feedId === selector &&
                              checkArticle(item.title, item.author)
                            );
                          }
                        })
                        .map((item, index) => (
                          <div key={index} className="mb-4">
                            <a
                              href={item.link}
                              onClick={(e) => {
                                if (document.body.offsetWidth > 640) {
                                  e.preventDefault();
                                  setSelectedArticle(item);
                                }
                              }}
                              className="text-black dark:text-white flex gap-4 hover:bg-[#f5f5f5] active:bg-[#e5e5e5] dark:hover:bg-[#FFFFFF14] dark:active:bg-[#FFFFFF1A] p-3 rounded-lg visited:text-[gray] "
                            >
                              <div className="right flex flex-col">
                                <span className="font-bold text-[16px]">
                                  {item.title}
                                </span>
                                <span className="text-sm previewText">
                                  by {item.author || item.creator} |{" "}
                                  {timeDifference(
                                    new Date(),
                                    new Date(item.pubDate)
                                  )}
                                  <br />
                                  <br />
                                  <span>{item.contentSnippet}</span>
                                </span>
                              </div>
                            </a>
                          </div>
                        ))}
                    </ul>
                  </>
                ) : feedsURLs.length === 0 && rendered ? (
                  <div className="text-left p-3">
                    <p className="text-gray-500">No feeds added yet</p>
                  </div>
                ) : (
                  <div className="flex justify-center items-center p-3">
                    <LoaderCircle className="animate-spin" />
                  </div>
                )}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="max-sm:hidden" />
            <ResizablePanel
              defaultSize={panelBalance}
              className="max-sm:hidden"
            >
              <div
                id="article-content"
                className="h-full w-full relative flex justify-center"
              >
                {selectedArticle != null && (
                  <div className="p-4 pt-1 overflow-y-auto custom-scrollbar h-full main-content max-w-3xl mt-6">
                    <h1>{selectedArticle.title}</h1>
                    <br />
                    <div className="flex gap-2">
                      <a href={selectedArticle.link}>
                        <Button>Read on original site</Button>
                      </a>
                      <ShareOptions
                        title={selectedArticle.title}
                        url={selectedArticle.link}
                        variant="full"
                      ></ShareOptions>
                    </div>
                    <br />
                    <article
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          selectedArticle.content || selectedArticle.summary
                        ),
                      }}
                    ></article>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </main>
    </SidebarProvider>
  );
}
