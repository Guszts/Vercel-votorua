import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHero() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Always land at the top of the page (the hero) when route changes
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}
