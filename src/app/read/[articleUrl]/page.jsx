import { Button } from "@/components/ui/button";
import ReadHistory from "@/components/ui/read-history";
import { extract } from "@extractus/article-extractor";
import Link from "next/link";

const ArticlePage = async ({ params }) => {
  let content = "";
  let title = "";
  let datePublished = "";
  let author = "";
  let error = "";
  let isLoading = true;
  let ttr = 0;
  let image;
  const { articleUrl } = params;
  let decodedUrl;
  try {
    decodedUrl = atob(decodeURIComponent(articleUrl.replaceAll("-", "/")));

    if (!decodedUrl.startsWith("http")) {
      decodedUrl = "https://" + decodedUrl;
    }

    const article = await extract(decodedUrl);
    title = article.title;
    datePublished = article.published;
    author = article.author;
    content = article.content;
    isLoading = false;
    ttr = article.ttr;
    image = article.image;
  } catch (err) {
    error = err.message;
    isLoading = false;
  }

  return (
    <div>
      <head>
        <title>{title}</title>
        <meta
          property="description"
          content={`Read article by ${author} on ${datePublished || ""}`}
        />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={`Read article by ${author} on ${datePublished || ""}`}
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta
          property="twitter:image"
          content={
            image ? `/api/imageProxy?url=${image}` : `/assets/poster.png`
          }
        />
        <meta property="image" content={image} />
        <meta
          name="og:image"
          content={
            image ? `/api/imageProxy?url=${image}` : `/assets/poster.png`
          }
        />
      </head>
      <main className="max-w-4xl mx-auto p-4 pt-0 rounded-lg mt-8 text-[18px] leading-relaxed">
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
              <Link href={decodedUrl}>
                <Button>Read on original site</Button>
              </Link>
              <Link href="/" className="text-black dark:text-white">
                <Button variant="outline">Back to home</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              <strong>By {author}</strong> |{" "}
              <em>{new Date(datePublished).toLocaleString()}</em>
              {ttr > 60 ? ` | ${(ttr - (ttr % 60)) / 60} min read` : ""}
            </p>
            <Link href={decodedUrl}>
              <Button>Read on original site</Button>
            </Link>
            <br />
            <br />
            <article
              className="prose lg:prose-xl"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </>
        )}
      </main>
      <ReadHistory
        data={{
          title: title,
          link: decodedUrl,
          pubDate: datePublished,
          author: author,
        }}
      />
    </div>
  );
};

export default ArticlePage;
