"use client";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/ui/cmd";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CommandPalette />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
