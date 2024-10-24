import BackButton from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/dark-toggle";
import { ShareOptions } from "@/components/ui/share-options";
import { extract } from "@extractus/article-extractor";
import { SettingsIcon } from "lucide-react";

const ArticlePage = async ({ params, searchParams }) => {
  let decodedUrl;
  try {
    let content = "";
    let title = "";
    let datePublished = "";
    let author = "";
    let error = "";
    let isLoading = true;
    let ttr = 0;
    let image;
    let isYouTubeVideo = false;
    let youtubeVideoId = "";
    const { articleUrl } = params;
    const src = searchParams.src || "reader";
    decodedUrl = atob(decodeURIComponent(articleUrl.replaceAll("-", "/")));

    if (!decodedUrl.startsWith("http")) {
      decodedUrl = "https://" + decodedUrl;
    }

    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/;
    const match = decodedUrl.match(youtubeRegex);
    if (match) {
      isYouTubeVideo = true;
      youtubeVideoId = match[1];
    }

    if (!isYouTubeVideo) {
      const article = await extract(decodedUrl);
      title = article.title;
      datePublished = article.published;
      author = article.author;
      content = article.content;
      ttr = article.ttr;
      image = article.image;
      console.log(article);
    } else {
      title = "Video";
    }
    isLoading = false;

    content.replaceAll("<a", "<a target='_blank'");

    return (
      <html lang="en">
        <head>
          <title>{title}</title>
          <meta
            property="description"
            content={`Read article by ${typeof author === "string" ? author : author.name} on ${datePublished || ""}`}
          />
          <meta property="og:title" content={title} />
          <meta
            property="og:description"
            content={`Read article by ${typeof author === "string" ? author : author.name} on ${datePublished || ""}`}
          />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:title" content={title} />
          <meta
            property="twitter:image"
            content="https://utfs.io/f/AVk7jyeh7wvQ6MWts5dEO1dsnUSH4tpvZbMTGau9x7o0jLYW"
          />
          <meta
            property="image"
            content="https://utfs.io/f/AVk7jyeh7wvQ6MWts5dEO1dsnUSH4tpvZbMTGau9x7o0jLYW"
          />
          <meta
            property="og:image"
            content="https://utfs.io/f/AVk7jyeh7wvQ6MWts5dEO1dsnUSH4tpvZbMTGau9x7o0jLYW"
          />
        </head>
        <body>
          {src == "reader" && (
            <header className="p-2 pl-4 pr-4 flex justify-between gap-4 items-center select-none fixed right-0 left-0 top-0 bg-white dark:bg-black">
              <div className="flex gap-4 items-center">
                <BackButton />
              </div>
              <div className="flex gap-2 items-center">
                <ModeToggle />
                <ShareOptions url={decodedUrl} title={title} />
                <a href="/settings" className="text-black dark:text-white">
                  <Button variant="outline" size="icon">
                    <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </a>
              </div>
            </header>
          )}
          <article
            className={
              "max-w-4xl mx-auto p-4 rounded-lg mt-8 text-[18px] leading-relaxed " +
              (src == "reader" ? "pt-16" : "")
            }
          >
            {isLoading ? (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Loading...
              </p>
            ) : error ? (
              <>
                <b>We're sorry, but we couldn't process this article.</b>
                <br />
                <br />
                <div className="flex gap-2">
                  <a href={decodedUrl}>
                    <Button>Read on original site</Button>
                  </a>
                  <a href="/" className="text-black dark:text-white">
                    <Button variant="outline">Back to home</Button>
                  </a>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                {!isYouTubeVideo && (
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    <strong>
                      By {typeof author === "string" ? author : author.name}
                    </strong>{" "}
                    | <em>{new Date(datePublished).toLocaleString()}</em>
                    {ttr > 60 ? ` | ${Math.floor(ttr / 60)} min read` : ""}
                  </p>
                )}
                <div className="flex gap-2">
                  <a href={decodedUrl}>
                    <Button>
                      {isYouTubeVideo
                        ? "Watch on YouTube"
                        : "Read on original site"}
                    </Button>
                  </a>
                  {src == "embed" && (
                    <ShareOptions
                      variant="full"
                      url={decodedUrl}
                      title={title}
                    />
                  )}
                </div>
                <br />
                <br />
                {isYouTubeVideo ? (
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full aspect-video"
                    ></iframe>
                  </div>
                ) : (
                  <article
                    className="prose lg:prose-xl"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                )}
              </>
            )}
          </article>
        </body>
      </html>
    );
  } catch (err) {
    return (
      <>
        <head>
          <title>Couldn't process article</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:title" content="Couldn't process article" />
          <meta
            property="og:description"
            content="We're sorry, but we couldn't process this article."
          />
          <meta property="og:image" content="/assets/poster.png" />
        </head>
        <div className="max-w-4xl mx-auto p-4 rounded-lg mt-12 text-[18px]">
          <b>We're sorry, but we couldn't process this article.</b>
          <br />
          <br />
          <div className="flex gap-2">
            <a href={decodedUrl}>
              <Button>Read on original site</Button>
            </a>
            {src == "reader" && (
              <a href="/" className="text-black dark:text-white">
                <Button variant="outline">Back to home</Button>
              </a>
            )}
          </div>
        </div>
      </>
    );
  }
};

export default ArticlePage;
