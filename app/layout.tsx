import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentra Systems — AI Agents That Replace Human Work",
  description:
    "From WhatsApp bots to full business automation. We build AI systems that capture leads, answer customers, book appointments, and run operations 24/7.",
  keywords:
    "AI automation agency, WhatsApp bot developer, AI chatbot services, AI agent development, business automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
