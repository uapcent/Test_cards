import { useEffect, useState } from "react";
import TokensPage from "./pages/TokensPage.jsx";
import ClassicPage from "./pages/ClassicPage.jsx";
import RankingsPage from "./pages/RankingsPage.jsx";

// Hash routes keep every page reachable on GitHub Pages without server rules
const PAGES = [
  { route: "tokens", label: "Tokens", Page: TokensPage },
  { route: "classic", label: "Classic", Page: ClassicPage },
  { route: "rankings", label: "Rankings", Page: RankingsPage }
];

function useHashRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, "") || "tokens";
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

export default function App() {
  const route = useHashRoute();
  const current = PAGES.find(page => page.route === route) ?? PAGES[0];
  const { Page } = current;

  return (
    <>
      <nav className="layout-nav" aria-label="Layouts">
        {PAGES.map(page => (
          <a
            key={page.route}
            href={`#/${page.route}`}
            aria-current={page === current ? "page" : undefined}
          >
            {page.label}
          </a>
        ))}
      </nav>
      <Page />
    </>
  );
}
