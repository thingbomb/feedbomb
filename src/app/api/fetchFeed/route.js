import jschardet from "jschardet";
import iconv from "iconv-lite";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Request missing required parameter 'url'.", {
      status: 400,
    });
  }

  if (url.endsWith("/api/fetchFeed")) {
    return new Response("You can't recursively call this endpoint.", {
      status: 400,
    });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return new Response("Failed to fetch the feed.", {
        status: response.status,
      });
    }

    const buffer = await response.arrayBuffer();

    const detectedEncoding = jschardet.detect(Buffer.from(buffer));
    let encoding = detectedEncoding.encoding || "utf-8";

    const decodedText = iconv.decode(Buffer.from(buffer), encoding);

    return new Response(decodedText, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "text/plain",
      },
    });
  } catch (error) {
    console.error("There was an error while fetching this feed: ", error);
    return new Response("There was an error while fetching this feed", {
      status: 500,
    });
  }
}
