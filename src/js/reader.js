let articleUrl;
try {
    articleUrl = atob(window.location.pathname.split("/")[2]);
} catch (error) {
    if (window.location.pathname.split("/")[2].startsWith("http")) {
        articleUrl = window.location.pathname.split("/")[2];
    } else {
        articleUrl = `https://${window.location.pathname.split("/")[2]}`;
    }
}

function fetchArticle(url) {
    fetch('https://us-central1-awesomerssfeedreader.cloudfunctions.net/fetchArticleText?url=' + articleUrl)
        .then(response => response.text())
        .then(text => {
            try {
                let placeholderElement = document.createElement("div");
                placeholderElement.innerHTML = text;
                document.querySelector("#articlecontent").innerHTML = placeholderElement.querySelector("article").innerHTML;
                document.querySelector("#articlecontent").querySelectorAll("button").forEach(button => {
                    button.remove()
                });
                document.getElementById("articletitle").textContent = placeholderElement.querySelector("h1").innerText;
                function removeNonPElements(element) {
                    let children = Array.from(element.childNodes);

                    children.forEach(child => {
                        if (child.nodeType === 1 && child.tagName.toLowerCase() !== 'p') {
                            if (!child.querySelector('p')) {
                                child.remove();
                            } else {
                                removeNonPElements(child);
                            }
                        }
                    });
                }
                removeNonPElements(document.querySelector("#articlecontent"));
            } catch (error) {
                window.location.href = articleUrl
            }
        })
        .catch(error => {
            window.location.href = articleUrl
        });
}

fetchArticle(articleUrl);