import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindPlay - Cognitive Gaming and Memory Assistance Platform",
  description:
    "Accessible web-based cognitive activities for elderly users, supporting memory observation and gentle stimulation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
