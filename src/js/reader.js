let queryParams = new URLSearchParams(window.location.search);
let articleUrl = queryParams.get("url");

function fetchArticle(url) {
    fetch('https://us-central1-awesomerssfeedreader.cloudfunctions.net/fetchArticleText?url=' + url)
        .then(response => response.text())
        .then(text => {
            try {
            let placeholderElement = document.createElement("div");
            placeholderElement.innerHTML = text;
            document.querySelector("#articlecontent").innerHTML = placeholderElement.querySelector("article").innerHTML;
            document.querySelector("#articlecontent").querySelectorAll("button").forEach(button => {
                button.remove()
            });
            document.getElementById("articletitle").innerHTML = placeholderElement.querySelector("h1").innerText;
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
            window.location.href = articleUrl;
        }
        })
        .catch(error => {
            window.location.href = articleUrl;
        });
}

fetchArticle(articleUrl);