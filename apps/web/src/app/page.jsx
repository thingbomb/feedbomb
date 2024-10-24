"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/dark-toggle";
import {
  SettingsIcon,
  LucideHome,
  LucidePlus,
  LoaderCircle,
} from "lucide-react";
import { CommandPalette } from "@/components/ui/cmd";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
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

export default function Home() {
  const [feedsJSON, setFeedsJSON] = useState([]);
  const [feedsURLs, setFeedsURLs] = useState([]);
  const [newFeedURL, setNewFeedURL] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selector, setSelector] = useState("all_posts");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pwaCardShowing, setPwaCardShowing] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [rules, setRules] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const [selectedArticleURL, setSelectedArticleURL] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [panelBalance, setPanelBalance] = useState(60);

  const openDialog = () => {
    setDialogOpen(true);
  };

  async function parseRSSFeed(xmlString, url) {
    let feed = {};
    let feedItems = [];
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");
      console.log(xmlDoc);
      let feedTitle = xmlDoc.querySelector("title")
        ? xmlDoc.querySelector("title").textContent
        : "";

      let feedIcon = xmlDoc.querySelector("link")
        ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
            xmlDoc.querySelector("link")?.getAttribute("href")?.split("/")[2] ||
              url.split("/")[2]
          )}&sz=32`
        : `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
            url.split("/")[2]
          )}&sz=32`;
      feed.title = feedTitle;
      feed.feedURL = url;
      feed.icon = feedIcon;
      feed.type = "feeds";

      let items =
        xmlDoc.querySelectorAll("item, entry") ||
        xmlDoc
          .querySelector("rss")
          .querySelector("channel")
          .querySelectorAll("item, entry");
      setFeeds((prev) => [
        ...prev,
        {
          title: feedTitle,
          feedURL: url,
          icon: feedIcon,
          type: "feeds",
        },
      ]);
      items.forEach((item) => {
        const title = item.querySelector("title")
          ? item.querySelector("title").textContent
          : "";
        const linkElement = item.querySelector("link");
        const content =
          item.getElementsByTagName("content:encoded")[0] ||
          item.querySelector("content") ||
          item.querySelector("description");
        const link = linkElement
          ? linkElement.getAttribute("href") || linkElement.textContent
          : "#";
        const description = item.querySelector("description, summary")
          ? item.querySelector("description, summary").textContent
          : "";

        let pubDate = item.querySelector("pubDate, published")
          ? item.querySelector("pubDate, published").textContent
          : "";
        let dateObj = new Date(pubDate);
        if (isNaN(dateObj.getTime())) dateObj = new Date();
        function stripHTML(input) {
          return input.replace(/<\/?[^>]+(>|$)/g, "");
        }
        let authorElement = item.querySelector("author");
        let dcCreatorElement = item.getElementsByTagName("dc:creator")[0];
        let author = authorElement
          ? authorElement.textContent ||
            authorElement.querySelector("name")?.textContent ||
            ""
          : dcCreatorElement
            ? dcCreatorElement.textContent
            : "";

        feedItems.push({
          title: title,
          link: link,
          description: stripHTML(content.textContent),
          pubDate: dateObj.toISOString(),
          author: author,
          feedURL: url,
        });
      });
    } catch (error) {
      console.error("Error parsing RSS feed:", error);
    }
    feed.items = feedItems;
    return feed;
  }

  function decodeHtmlEntities(str) {
    const entities = {
      "&lt;": "<",
      "&gt;": ">",
      "&amp;": "&",
      "&quot;": '"',
      "&#39;": "'",
    };
    return str.replace(
      /&(lt|gt|amp|quot|#39);/g,
      (match, p1) => entities[match] || match
    );
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

  function decodeHtmlEntities(str) {
    const entities = {
      "&lt;": "<",
      "&gt;": ">",
      "&amp;": "&",
      "&quot;": '"',
      "&#39;": "'",
    };

    return str.replace(
      /&(lt|gt|amp|quot|#39);/g,
      (match, p1) => entities[match] || match
    );
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
                  if (feed.type != "feeds") return null;
                  return (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        asChild
                        isActive={selector == feed.feedURL}
                        className="select-none cursor-pointer"
                        onClick={() => setSelector(feed.feedURL)}
                      >
                        <span>{feed.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
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
                              item.feedURL === selector &&
                              checkArticle(item.title, item.author)
                            );
                          }
                        })
                        .map((item, index) => (
                          <div key={index} className="mb-4">
                            <a
                              href={
                                "/read/" + btoa(item.link).replaceAll("/", "-")
                              }
                              onClick={(e) => {
                                if (document.body.offsetWidth > 640) {
                                  e.preventDefault();
                                  setIframeLoaded(false);
                                  setSelectedArticleURL(
                                    `/read/${btoa(item.link).replaceAll("/", "-")}?src=embed`
                                  );
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
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: item.description,
                                    }}
                                  ></span>
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
              <div id="article-content" className="h-full w-full relative">
                {selectedArticleURL != null && (
                  <>
                    {!iframeLoaded ? (
                      <div className="flex justify-center items-center p-3">
                        {selectedArticleURL != null ? (
                          <div className="absolute inset-0 flex justify-center items-center">
                            <LoaderCircle className="animate-spin" />
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    <iframe
                      src={selectedArticleURL}
                      onLoad={() => {
                        setIframeLoaded(true);
                      }}
                      className={iframeLoaded ? "h-full w-full" : "hidden"}
                    ></iframe>
                  </>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </main>
    </SidebarProvider>
  );
}
