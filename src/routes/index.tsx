import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { setFixtureId } from "@/store/activeFixture";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  useEffect(() => {
    setFixtureId(null);
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-text-muted text-sm">
        Select a match from the sidebar to view stats
      </p>
    </div>
  );
}
