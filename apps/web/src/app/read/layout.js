"use client";

import localFont from "next/font/local";
import "../globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ModeToggle } from "@/components/ui/dark-toggle";
import { SettingsIcon } from "lucide-react";
import { ShareOptions } from "@/components/ui/share-options";
import { usePathname, useSearchParams } from "next/navigation";
import { CommandPalette } from "@/components/ui/cmd";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const src = searchParams.get("src") || "reader";
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="grid grid-rows-[50px_calc(100vh_-_50px)] h-full w-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {src == "reader" && (
            <header className="p-2 pl-4 pr-4 flex justify-between gap-4 items-center select-none fixed right-0 left-0 top-0 bg-white dark:bg-black">
              <div className="flex gap-4 items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => history.back()}
                >
                  <ChevronLeft className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </div>
              <div className="flex gap-2 items-center">
                <CommandPalette />
                <ModeToggle />
                <ShareOptions
                  url={`${
                    atob(pathname.split("/")[2].replaceAll("-", "/")) ||
                    `https://feedbomb.app${pathname}`
                  }`}
                />
                <a href="/settings" className="text-black dark:text-white">
                  <Button variant="outline" size="icon">
                    <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </a>
              </div>
            </header>
          )}
          <article>{children}</article>
        </ThemeProvider>
      </body>
    </html>
  );
}
