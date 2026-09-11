import { useEffect } from "react";
import WebsiteApp from "@/website/App";

const WEBSITE_STYLE_ID = "corpus-new-website-style";

export function NewWebsiteScreen() {
  useEffect(() => {
    let link = document.getElementById(WEBSITE_STYLE_ID) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = WEBSITE_STYLE_ID;
      link.rel = "stylesheet";
      link.href = "/website.css";
      document.head.appendChild(link);
    }
    return () => {
      document.getElementById(WEBSITE_STYLE_ID)?.remove();
    };
  }, []);

  return <WebsiteApp />;
}
