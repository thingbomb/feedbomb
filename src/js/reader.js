let queryParams = new URLSearchParams(window.location.search);
let articleUrl = queryParams.get("url");

function fetchArticle(url) {
    fetch('https://us-central1-awesomerssfeedreader.cloudfunctions.net/fetchArticleText?url=' + url)
        .then(response => response.text())
        .then(text => {
            let placeholderElement = document.createElement("div");
            placeholderElement.innerHTML = text;
            document.querySelector("#articlecontent").innerHTML = placeholderElement.querySelector("article").innerHTML;
            document.querySelector("#articlecontent").querySelectorAll("button").forEach(button => {
                button.remove()
            });
            document.getElementById("articletitle").innerHTML = placeholderElement.querySelector("h1").innerText;
            function removeNonPElements(element) {
                // Get all child nodes of the current element
                let children = Array.from(element.childNodes);
                
                // Loop through the child nodes
                children.forEach(child => {
                    // If the child is an element and not a <p>
                    if (child.nodeType === 1 && child.tagName.toLowerCase() !== 'p') {
                        // If the child element doesn't contain a <p>, remove it
                        if (!child.querySelector('p')) {
                            child.remove();
                        } else {
                            // If it does contain a <p>, apply the function recursively
                            removeNonPElements(child);
                        }
                    }
                });
            }
            removeNonPElements(document.querySelector("#articlecontent"));
        });
}

fetchArticle(articleUrl);