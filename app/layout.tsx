"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Rightbar from "@/components/Rightbar";
import FooterPlayer from "@/components/FooterPlayer";
import React, { useState } from "react";

const font = Figtree({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showRightbar, setShowRightbar] = useState(true);
  return (
    <html lang="en" className={font.className}>
      <body className={font.className + " bg-black"}>
        <div className="flex flex-col min-h-0 min-w-0 h-full w-full overflow-hidden">
  <Topbar />
  <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
    <Sidebar />
    <main className={`flex-1 min-h-0 min-w-0 overflow-y-auto custom-scrollbar px-1 md:px-2 pt-1 md:pt-1.5 backdrop-blur-md bg-black/70 ${showRightbar ? '' : 'w-full'}`}>
      {children}
    </main>
    {showRightbar && <Rightbar />}
  </div>
  <FooterPlayer showRightbar={showRightbar} setShowRightbar={setShowRightbar} />
</div>
      </body>
    </html>
  );
}

