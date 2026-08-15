import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CORPUS — Learn Anatomy. Master Life.",
  description:
    "A Duolingo-style anatomy learning app. Interactive lessons, smart quizzes, 3D study mode and gamified progress.",
};

export const viewport: Viewport = {
  themeColor: "#6C5CE7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

/* Apply dark mode before hydration to avoid a flash of the wrong theme. */
const themeInit = `(function(){try{var s=JSON.parse(localStorage.getItem('corpus-storage')||'{}');if(s.state&&s.state.settings&&s.state.settings.darkMode){document.documentElement.classList.add('dark')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
