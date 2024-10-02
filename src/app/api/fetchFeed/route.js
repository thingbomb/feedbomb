// route.js

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response('Missing "url" parameter', { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return new Response("Failed to fetch the URL", {
        status: response.status,
      });
    }

    const text = await response.text();
    return new Response(text, {
      headers: {
        "Content-Type": response.headers.get("Content-Type"),
      },
    });
  } catch (error) {
    return new Response("Error fetching the URL", { status: 500 });
  }
}
