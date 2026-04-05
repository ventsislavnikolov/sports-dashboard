import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { setFixtureId } from "@/store/activeFixture";

export const Route = createFileRoute("/fixture/$fixtureId")({
  component: FixturePage,
});

function FixturePage() {
  const { fixtureId } = Route.useParams();
  const numericId = Number(fixtureId);

  useEffect(() => {
    if (!isNaN(numericId)) {
      setFixtureId(numericId);
    }
  }, [numericId]);

  return (
    <div className="p-4">
      <p className="text-text-muted text-xs">
        Fixture #{numericId} — cards will render here
      </p>
    </div>
  );
}
