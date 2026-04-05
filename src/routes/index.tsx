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
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-text-muted">
        Select a match from the sidebar to view stats
      </p>
    </div>
  );
}
