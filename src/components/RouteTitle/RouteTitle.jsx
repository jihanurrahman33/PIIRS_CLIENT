import { useEffect } from "react";
import { useMatches } from "react-router";

const RouteTitle = () => {
  const matches = useMatches();

  useEffect(() => {
    // Find the deepest route that has a title
    const matchWithTitle = [...matches]
      .reverse()
      .find(match => match.handle?.title);

    const title = matchWithTitle?.handle?.title || "PIIRS";

    document.title = `${title} | PIIRS`;
  }, [matches]);

  return null;
};

export default RouteTitle;
