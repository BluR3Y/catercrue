import type { Metadata } from "next";
import { ThemeWrapper } from "@/components/ThemeWrapper";


export const metadata: Metadata = {
    title: "Crue - Event Management & Staffing Platform",
    description: "Generated by create next app",
    manifest: '/manifest.json'
};

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    return (
      <html lang="en">
        <body>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </body>
      </html>
    );
  }