import { redirect } from "next/navigation";

const ArticlePage = async ({ params, searchParams }) => {
  const { articleUrl } = params;
  const decodedUrl = atob(decodeURIComponent(articleUrl.replaceAll("-", "/")));
  redirect(decodedUrl);
};

export default ArticlePage;
