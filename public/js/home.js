let allFeeds = [];
let currentFilter = "all+posts";

function cleanUpExpiredCache() {
  const cache = localStorage;
  for (let i = 0; i < cache.length; i++) {
    const key = cache.key(i);
    const value = JSON.parse(cache.getItem(key));
    if (value.expire) {
      if (value.expire < Date.now()) {
        cache.removeItem(key);
      }
    }
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

function areDatesOnTheSameDay(date1, date2) {
  function getDateParts(date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
    };
  }

  const date1Parts = getDateParts(date1);
  const date2Parts = getDateParts(date2);

  return (
    date1Parts.year === date2Parts.year &&
    date1Parts.month === date2Parts.month &&
    date1Parts.day === date2Parts.day
  );
}

function removeEscapeCharacters(str) {
  return str.replaceAll("\\", "");
}

let feedsFailedToLoad = 0;

function fetchFeed(url) {
  return new Promise(async (resolve, reject) => {
    let responseText;
    try {
      if (
        !localStorage.getItem(url) ||
        JSON.parse(localStorage.getItem(url)).expire < Date.now()
      ) {
        const response = await fetch(
          "/api/fetchFeed?url=" + encodeURIComponent(url)
        );
        responseText = await response.text();
        if (!response.ok || !responseText.startsWith("<?xml")) {
          feedsFailedToLoad++;
          document.getElementById(
            "status"
          ).innerHTML = `Failed to load ${feedsFailedToLoad} ${
            feedsFailedToLoad === 1 ? "feed" : "feeds"
          }`;
          reject([]);
          return;
        }
        localStorage.setItem(
          url,
          JSON.stringify({
            expire: Date.now() + 30 * 60 * 1000,
            data: responseText,
          })
        );
      } else {
        const data = localStorage.getItem(url);
        responseText = JSON.parse(data).data;
      }
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(responseText, "application/xml");
      let feedTitle = xmlDoc.querySelector("title")
        ? xmlDoc.querySelector("title").textContent
        : "";
      let items =
        xmlDoc.querySelectorAll("item, entry") ||
        xmlDoc
          .querySelector("rss")
          .xmlDoc.querySelector("channel")
          .querySelectorAll("item, entry");
      let icon = `<img height="24" src="https://logo.clearbit.com/${
        url.split("/")[2]
      }" onerror="this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/WRJ4pQAAAAASUVORK5CYII='">`;

      if (
        !document.querySelector(`.feed-item[data-feed-title="${feedTitle}"]`)
      ) {
        const feedList = document.querySelector(".feed-list");

        const button = document.createElement("button");
        button.className = "feed-item";
        button.dataset.feedTitle = feedTitle;

        const spacer = document.createElement("div");
        spacer.className = "spacer";

        const span = document.createElement("span");
        span.textContent = feedTitle;

        const icon = document.createElement("img");
        icon.src = `https://logo.clearbit.com/${encodeURIComponent(
          url.split("/")[2]
        )}`;
        icon.className = "icon";

        button.appendChild(icon);
        button.appendChild(spacer);
        button.appendChild(span);

        button.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          if (confirm("Are you sure you want to delete this feed?")) {
            removeFeed(url);
          }
        });

        button.addEventListener("click", () => {
          filterFeeds(feedTitle);
        });

        feedList.appendChild(button);
      }

      let feedItems = [];
      items.forEach((item) => {
        const title = item.querySelector("title")
          ? item.querySelector("title").textContent
          : "";
        const linkElement = item.querySelector("link");
        const content =
          (item.getElementsByTagName("content:encoded")[0]
            ? item.getElementsByTagName("content:encoded")[0]
            : item.querySelector("content")
            ? item.querySelector("content")
            : null) || "";
        const link = linkElement
          ? linkElement.getAttribute("href") || linkElement.textContent
          : "#";
        const description = item.querySelector("description, summary")
          ? item.querySelector("description, summary").textContent
          : "";
        let placeholder = document.createElement("div");
        let potentialImage;
        if (content.innerHTML) {
          placeholder.innerHTML = decodeHtmlEntities(content.innerHTML);
          potentialImage =
            item.getElementsByTagName("media:thumbnail").src ||
            item
              .getElementsByTagName("media:content")[0]
              ?.getAttribute("url") ||
            (placeholder.querySelector("img")
              ? placeholder.querySelector("img").src
              : `https://logo.clearbit.com/${url.split("/")[2]}`);
        } else {
          placeholder.innerHTML = description
            ? description
            : new Date(
                item.querySelector("pubDate, published")
                  ? item.querySelector("pubDate, published").textContent
                  : ""
              ).toDateString();
          potentialImage =
            item.getElementsByTagName("media:thumbnail")?.url ||
            `https://logo.clearbit.com/${url.split("/")[2]}`;
        }

        let pubDate = item.querySelector("pubDate, published")
          ? item.querySelector("pubDate, published").textContent
          : "";
        let dateObj = new Date(pubDate);
        let fullDescription = placeholder.innerText;
        let authorElement = item.querySelector("author");
        let dcCreatorElement = item.getElementsByTagName("dc:creator")[0];
        let author = authorElement
          ? authorElement.textContent ||
            authorElement.querySelector("name")?.textContent ||
            ""
          : dcCreatorElement
          ? dcCreatorElement.textContent
          : "";
        if (isNaN(dateObj.getTime())) {
          dateObj = new Date();
        }

        feedItems.push({
          title: title,
          link: link,
          description: fullDescription,
          pubDate: dateObj.toISOString(),
          feedTitle: feedTitle,
          image: potentialImage,
          author: author,
        });
      });

      resolve(feedItems);
    } catch (error) {
      console.error("Failed to fetch the feed:", error);
      reject([]);
    }
  });
}

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + "s";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + "m";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + "h";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + "d";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + "mo";
  } else {
    return Math.round(elapsed / msPerYear) + "y";
  }
}

async function getSavedFeeds() {
  const savedFeeds = localStorage.getItem("savedFeeds");
  if (savedFeeds) {
    const parsedFeeds = JSON.parse(savedFeeds);

    const results = await Promise.allSettled(
      parsedFeeds.map((feed) => fetchFeed(feed))
    );

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        allFeeds.push(...result.value);
      }
    });

    allFeeds.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    filterFeeds("all+posts");

    if (!document.querySelector(".feed-item.add-feed")) {
      let addFeedButton = document.createElement("button");
      addFeedButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z"/></svg><div class="spacer"></div><span>Add feed</span>`;
      addFeedButton.className = "feed-item add-feed";
      addFeedButton.addEventListener("click", addFeed);
      document.querySelector(".feed-list").appendChild(addFeedButton);
    }
  } else {
    document.querySelector("#feed-content").innerHTML =
      "<span style='padding: 10px;'>No feeds saved</span>";
    if (!document.querySelector(".feed-item.add-feed")) {
      let addFeedButton = document.createElement("button");
      addFeedButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z"/></svg><div class="spacer"></div><span>Add feed</span>`;
      addFeedButton.className = "feed-item add-feed";
      addFeedButton.addEventListener("click", addFeed);
      document.querySelector(".feed-list").appendChild(addFeedButton);
    }
  }
  if (!document.querySelector(".feed-item.import-opml")) {
    let importOpmlButton = document.createElement("input");
    importOpmlButton.type = "file";
    importOpmlButton.accept = ".opml";
    importOpmlButton.id = "import-opml";
    importOpmlButton.addEventListener("change", addFeed);
    importOpmlButton.style.display = "none";
    document.querySelector(".feed-list").appendChild(importOpmlButton);
    importOpmlButton.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
          const urls = extractURLs(xmlDoc);
        };
        reader.readAsText(file);
      }
    });
    let buttonLabel = document.createElement("label");
    buttonLabel.innerHTML = "Import OPML";
    buttonLabel.className = "feed-item import-opml";
    buttonLabel.setAttribute("for", "import-opml");
    buttonLabel.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg><div class="spacer"></div><span>Import OPML</span>';
    document.querySelector(".feed-list").appendChild(buttonLabel);
  }
}

async function addFeedURL() {
  let url = document.getElementById("feed-url").value;
  if (url) {
    if (url.startsWith("r/") || url.startsWith("/r/")) {
      const subreddit = url.split("r/")[1];
      url = `https://www.reddit.com/r/${subreddit}/.rss`;
    } else if (!url.startsWith("http")) {
      url = `https://${url}`;
    }
    let savedFeeds = JSON.parse(localStorage.getItem("savedFeeds")) || [];
    savedFeeds.push(url);
    localStorage.setItem("savedFeeds", JSON.stringify(savedFeeds));
    window.location.reload();
  }
}

async function addFeed() {
  document.getElementById("articles").style.display = "none";
  document.getElementById("add-feed").style.display = "";
}

async function filterFeeds(feedTitle, searchTerm) {
  currentFilter = feedTitle;
  document.getElementById("add-feed").style.display = "none";
  document.getElementById("articles").style.display = "";
  let copiedArray = [...allFeeds];

  function copiedArrayHandler(copiedArray) {
    if (feedTitle.split(" - ")[1]) {
      document.getElementById("feedTitle").innerHTML =
        feedTitle.split(" - ")[0];
      document.getElementById("category").innerHTML = feedTitle.split(" - ")[1];
      document.getElementById("category").style.display = "block";
    } else {
      document.getElementById("feedTitle").innerHTML =
        feedTitle == "all+posts" ? "Home" : feedTitle;
      document.getElementById("category").style.display = "none";
    }

    copiedArray.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    document.querySelector("#feed-content").innerHTML = "";
    let lastDate;
    function formatDate(date) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Intl.DateTimeFormat("en-US", options)
        .format(date)
        .toUpperCase();
    }
    copiedArray.forEach((feed) => {
      if (lastDate) {
        if (!areDatesOnTheSameDay(new Date(feed.pubDate), lastDate)) {
          let dateMarker = document.createElement("div");
          dateMarker.className = "dateMarker";
          dateMarker.innerHTML = formatDate(lastDate);
          document.getElementById("feed-content").appendChild(dateMarker);
        }
      } else {
        if (areDatesOnTheSameDay(new Date(feed.pubDate), new Date())) {
          let dateMarker = document.createElement("div");
          dateMarker.className = "dateMarker";
          dateMarker.innerHTML = "TODAY";
          document.getElementById("feed-content").appendChild(dateMarker);
        } else {
          let dateMarker = document.createElement("div");
          dateMarker.className = "dateMarker";
          dateMarker.innerHTML = formatDate(new Date(feed.pubDate));
          document.getElementById("feed-content").appendChild(dateMarker);
        }
      }
      lastDate = new Date(feed.pubDate);
      let newFeedItem = document.createElement("a");
      newFeedItem.className = "article";
      newFeedItem.href = `read/${btoa(feed.link)}`;
      newFeedItem.innerHTML = `<img src="${feed.image}" class="thumbnail">
            <div class="spacer"></div>
            <div class="content">
                <span class="headline">${DOMPurify.sanitize(feed.title)}</span>
                <span class="text">by ${DOMPurify.sanitize(
                  feed.author
                )} / ${timeDifference(
        new Date(),
        new Date(feed.pubDate)
      )}<br><br>${DOMPurify.sanitize(
        feed.description ? feed.description : ""
      )}</span>
            </div>`;
      document.getElementById("feed-content").appendChild(newFeedItem);
    });
  }

  if (feedTitle !== "all+posts") {
    copiedArray = await copiedArray.filter((feed) => {
      return feed.feedTitle
        .toLowerCase()
        .trim()
        .replaceAll(" ", "")
        .includes(feedTitle.toLowerCase().trim().replaceAll(" ", ""));
    });
    if (searchTerm) {
      copiedArray = await copiedArray.filter((feed) => {
        return feed.title
          .toLowerCase()
          .trim()
          .replaceAll(" ", "")
          .includes(searchTerm.toLowerCase().trim().replaceAll(" ", ""));
      });
      copiedArrayHandler(copiedArray);
    } else {
      copiedArrayHandler(copiedArray);
    }
  } else {
    if (searchTerm) {
      copiedArray = await copiedArray.filter((feed) => {
        return feed.title
          .toLowerCase()
          .trim()
          .replaceAll(" ", "")
          .includes(searchTerm.toLowerCase().trim().replaceAll(" ", ""));
      });
      copiedArrayHandler(copiedArray);
    } else {
      copiedArrayHandler(copiedArray);
    }
  }
}

function extractURLs(xmlDoc) {
  const outlines = xmlDoc.getElementsByTagName("outline");
  const urls = [];

  for (let i = 0; i < outlines.length; i++) {
    const url =
      outlines[i].getAttribute("xmlUrl") || outlines[i].getAttribute("url");
    if (url) {
      urls.push(url);
    }
  }

  if (!localStorage.getItem("savedFeeds")) {
    localStorage.setItem("savedFeeds", JSON.stringify(urls));
    window.location.reload();
    return;
  }

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (url.startsWith("http")) {
      localStorage.setItem(
        "savedFeeds",
        JSON.stringify(
          JSON.parse(localStorage.getItem("savedFeeds")) || []
        ).concat(url)
      );
    } else {
      localStorage.setItem(
        "savedFeeds",
        JSON.stringify(
          JSON.parse(localStorage.getItem("savedFeeds")) || []
        ).concat(`https://${url}`)
      );
    }
  }
  window.location.reload();
  return;
}

document
  .getElementById("add-feed-button")
  .addEventListener("click", addFeedURL);
document.getElementById("feed-url").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addFeedURL();
  }
});
document.getElementById("search").addEventListener("keyup", function (event) {
  filterFeeds(currentFilter, event.target.value);
});

getSavedFeeds();

function removeFeed(url) {
  if (localStorage.getItem(url)) {
    localStorage.removeItem(url);
  }
  if (localStorage.getItem("savedFeeds")) {
    let curSavedFeeds = JSON.parse(localStorage.getItem("savedFeeds"));
    curSavedFeeds = curSavedFeeds.filter((feed) => feed !== url);
    localStorage.setItem("savedFeeds", JSON.stringify(curSavedFeeds));
    window.location.reload();
  }
}
