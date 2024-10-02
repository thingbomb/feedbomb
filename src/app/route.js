// app/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "src", "app", "index.html");

  const htmlContent = fs.readFileSync(filePath, "utf-8");

  return new Response(htmlContent, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
