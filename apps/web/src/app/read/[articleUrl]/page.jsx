import { redirect } from "next/navigation";

export const runtime = "edge";

const ArticlePage = async ({ params, searchParams }) => {
  const { articleUrl } = params;
  const decodedUrl = atob(decodeURIComponent(articleUrl.replaceAll("-", "/")));
  redirect(decodedUrl);
};

export default ArticlePage;
