let allFeeds = [];

function decodeHtmlEntities(str) {
    return str
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&amp;', '&')
        .replaceAll('&quot;', '"')
        .replaceAll('&#39;', "'");
}

function areDatesOnTheSameDay(date1, date2) {
    function getDateParts(date) {
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
        };
    }

    const date1Parts = getDateParts(date1);
    const date2Parts = getDateParts(date2);

    return date1Parts.year === date2Parts.year &&
        date1Parts.month === date2Parts.month &&
        date1Parts.day === date2Parts.day;
}

function fetchFeed(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch('https://us-central1-awesomerssfeedreader.cloudfunctions.net/getFeed?url=' + url);
            const text = await response.text();

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "application/xml");
            let feedTitle = xmlDoc.querySelector("title") ? xmlDoc.querySelector("title").textContent : "";
            let items = xmlDoc.querySelectorAll("item, entry");
            let icon = `<img height="24" src="https://logo.clearbit.com/${url.split("/")[2]}">`

            if (!document.querySelector(`.feed-item[data-feed-title="${feedTitle}"]`)) {
                document.querySelector(".feed-list").innerHTML += `<button class="feed-item" data-feed-title="${feedTitle}" onclick="filterFeeds('${feedTitle}')">${icon}<div class="spacer"></div><span>${feedTitle}</span></button>`;
            }

            let feedItems = [];
            items.forEach(item => {
                const title = item.querySelector("title") ? item.querySelector("title").textContent : "";
                const linkElement = item.querySelector("link");
                const content = item.getElementsByTagName("content:encoded")[0] ? item.getElementsByTagName("content:encoded")[0] : (item.querySelector("content") ? item.querySelector("content") : null);
                console.log(item.getElementsByTagName("content:encoded"))
                const link = linkElement ? (linkElement.getAttribute("href") || linkElement.textContent) : "#";
                const description = item.querySelector("description, summary") ? item.querySelector("description, summary").textContent : "";
                let placeholder = document.createElement("div");
                let potentialImage;
                if (content.innerHTML) {
                    placeholder.innerHTML = decodeHtmlEntities(content.innerHTML);
                    potentialImage = placeholder.querySelector("img") ? placeholder.querySelector("img").src : `https://logo.clearbit.com/${url.split("/")[2]}`;
                } else {
                    placeholder.innerHTML = description ? description : new Date(item.querySelector("pubDate, updated") ? item.querySelector("pubDate, updated").textContent : "").toDateString();
                }

                let pubDate = item.querySelector("pubDate, updated") ? item.querySelector("pubDate, updated").textContent : "";
                let dateObj = new Date(pubDate);
                let fullDescription = placeholder.innerText;
                let authorElement = item.querySelector("author");
                let dcCreatorElement = item.getElementsByTagName("dc:creator")[0];
                let author = authorElement ? (authorElement.textContent || authorElement.querySelector("name")?.textContent || "") : (dcCreatorElement ? dcCreatorElement.textContent : "");
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
                    author: author
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
        return Math.round(elapsed / 1000) + 's';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + 'm';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + 'h';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + 'd';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + 'mo';
    }

    else {
        return Math.round(elapsed / msPerYear) + 'y';
    }
}

async function getSavedFeeds() {
    const savedFeeds = localStorage.getItem("savedFeeds");
    if (savedFeeds) {
        const parsedFeeds = JSON.parse(savedFeeds);

        const results = await Promise.allSettled(parsedFeeds.map(feed => fetchFeed(feed)));

        results.forEach(result => {
            if (result.status === 'fulfilled') {
                allFeeds.push(...result.value);
            }
        });

        allFeeds.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        document.querySelector("#feed-content").innerHTML = allFeeds.map(feed =>
            `<a class="article" href="${feed.link}">
                <img src="${feed.image}" class="thumbnail">
                <div class="spacer"></div>
                <div class="content">
                <span class="headline">${feed.title}</span>
                <span class="text">${feed.feedTitle} / ${timeDifference(new Date(), new Date(feed.pubDate))}<br><br>${feed.description ? feed.description : ""}</span>
                </div>
            </a>`
        ).join("");

        if (!document.querySelector(".feed-item.add-feed")) {
            let addFeedButton = document.createElement("button");
            addFeedButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z"/></svg><span>Add feed</span>`;
            addFeedButton.className = "feed-item add-feed";
            addFeedButton.addEventListener("click", addFeed);
            document.querySelector(".feed-list").appendChild(addFeedButton);
        }
    } else {
        document.querySelector("#feed-content").innerHTML = "No feeds saved";
        if (!document.querySelector(".feed-item.add-feed")) {
            let addFeedButton = document.createElement("button");
            addFeedButton.innerHTML = "Add feed";
            addFeedButton.className = "feed-item add-feed";
            addFeedButton.addEventListener("click", addFeed);
            document.querySelector(".feed-list").appendChild(addFeedButton);
        }
    }
}

async function addFeed() {
    const url = prompt("Enter the URL of the feed");
    if (url) {
        let savedFeeds = JSON.parse(localStorage.getItem("savedFeeds")) || [];
        savedFeeds.push(url);
        localStorage.setItem("savedFeeds", JSON.stringify(savedFeeds));
        window.location.reload();
    }
}

function filterFeeds(feedTitle) {
    let copiedArray = [...allFeeds];

    if (feedTitle !== "all+posts") {
        copiedArray = copiedArray.filter(feed =>
            feed.feedTitle.toLowerCase().trim().replaceAll(" ", "").includes(feedTitle.toLowerCase().trim().replaceAll(" ", ""))
        );
    }

    if (feedTitle.split(" - ")[1]) {
        document.getElementById("feedTitle").innerHTML = feedTitle.split(" - ")[0];
        document.getElementById("category").innerHTML = feedTitle.split(" - ")[1];
        document.getElementById("category").style.display = "block";
    } else {
        document.getElementById("feedTitle").innerHTML = feedTitle == "all+posts" ? "Home" : feedTitle;
        document.getElementById("category").style.display = "none";
    }


    copiedArray.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    document.querySelector("#feed-content").innerHTML = "";
    let lastDate;
    function formatDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date).toUpperCase();
    }
    copiedArray.forEach(feed => {
        if (lastDate) {
            if (!areDatesOnTheSameDay(new Date(feed.pubDate), lastDate)) {
                let dateMarker = document.createElement("div")
                dateMarker.className = "dateMarker"
                dateMarker.innerHTML = formatDate(lastDate)
                document.getElementById("feed-content").appendChild(dateMarker)
            }
        } else {
            if (areDatesOnTheSameDay(new Date(feed.pubDate), new Date())) {
                let dateMarker = document.createElement("div")
                dateMarker.className = "dateMarker"
                dateMarker.innerHTML = 'TODAY'
                document.getElementById("feed-content").appendChild(dateMarker)
            } else {
                let dateMarker = document.createElement("div")
                dateMarker.className = "dateMarker"
                dateMarker.innerHTML = formatDate(new Date(feed.pubDate))
                document.getElementById("feed-content").appendChild(dateMarker)
            }
        }
        lastDate = new Date(feed.pubDate);
        let newFeedItem = document.createElement("a")
        newFeedItem.className = "article"
        newFeedItem.href = feed.link
        newFeedItem.innerHTML = `<img src="${feed.image}" class="thumbnail">
        <div class="spacer"></div>
        <div class="content">
            <span class="headline">${feed.title}</span>
            <span class="text">by ${feed.author} / ${timeDifference(new Date(), new Date(feed.pubDate))}<br><br>${feed.description ? feed.description : ""}</span>
        </div>`
        document.getElementById("feed-content").appendChild(newFeedItem)
    });
}

getSavedFeeds();
