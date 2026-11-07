import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "AUREX AI — Brand Governance & Intelligence",
  description: "Enterprise Brand Governance & Intelligence Platform. Your Brand. One Standard. Everywhere. Verify claims, voice, terminology, and visual standards against approved Brand DNA before publication.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-midnight text-offwhite font-sans antialiased selection:bg-teal-muted/30 selection:text-offwhite">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
