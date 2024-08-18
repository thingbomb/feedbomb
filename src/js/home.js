let allFeeds = [];

function fetchFeed(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch('https://us-central1-awesomerssfeedreader.cloudfunctions.net/getFeed?url=' + url);
            const text = await response.text();

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "application/xml");
            let feedTitle = xmlDoc.querySelector("title") ? xmlDoc.querySelector("title").textContent : "";
            let items = xmlDoc.querySelectorAll("item, entry");

            // Check if the button already exists to prevent duplicates
            if (!document.querySelector(`.feed-item[data-feed-title="${feedTitle}"]`)) {
                document.querySelector(".feed-list").innerHTML += `<button class="feed-item" data-feed-title="${feedTitle}" onclick="filterFeeds('${feedTitle}')">${feedTitle}</button>`;
            }

            let feedItems = [];
            items.forEach(item => {
                const title = item.querySelector("title") ? item.querySelector("title").textContent : "";
                const linkElement = item.querySelector("link");
                const link = linkElement ? (linkElement.getAttribute("href") || linkElement.textContent) : "#";
                const description = item.querySelector("description, summary") ? item.querySelector("description, summary").textContent : null;
                
                let pubDate = item.querySelector("pubDate, updated") ? item.querySelector("pubDate, updated").textContent : "";
                let dateObj = new Date(pubDate);

                if (isNaN(dateObj.getTime())) {
                    dateObj = new Date();
                }

                feedItems.push({
                    title: title,
                    link: link,
                    description: description,
                    pubDate: dateObj.toISOString(),
                    feedTitle: feedTitle
                });
            });

            resolve(feedItems);
        } catch (error) {
            console.error("Failed to fetch the feed:", error);
            reject([]);
        }
    });
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
                <span class="headline">${feed.title}</span>
                <span class="text">${feed.description ? feed.description : new Date(feed.pubDate).toDateString()}</span>
            </a>`
        ).join("");

        if (!document.querySelector(".feed-item.add-feed")) {
            let addFeedButton = document.createElement("button");
            addFeedButton.innerHTML = "Add feed";
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

    copiedArray.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    document.querySelector("#feed-content").innerHTML = copiedArray.map(feed => 
        `<a class="article" href="${feed.link}">
            <span class="headline">${feed.title}</span>
            <span class="text">${feed.description ? feed.description : new Date(feed.pubDate).toDateString()}</span>
        </a>`
    ).join("");
}

getSavedFeeds();
