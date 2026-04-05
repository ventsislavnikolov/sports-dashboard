import { useStore } from "@tanstack/react-store";
import { activeFixtureStore } from "@/store/activeFixture";
import { CardShell } from "@/shared/CardShell";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { PlayerMatchStat } from "@/api/types";

interface ShotCompareCardProps {
  allPlayers: PlayerMatchStat[];
  isLoading: boolean;
  dataUpdatedAt: number;
}

export function ShotCompareCard({
  allPlayers,
  isLoading,
  dataUpdatedAt,
}: ShotCompareCardProps) {
  const comparedPlayerIds = useStore(
    activeFixtureStore,
    (s) => s.comparedPlayerIds
  );

  const players = comparedPlayerIds
    .filter((id): id is number => id !== null)
    .map((id) => allPlayers.find((p) => p.player.id === id))
    .filter((p): p is PlayerMatchStat => p !== undefined);

  const chartData = players.map((p) => ({
    name: p.player.name,
    shots: p.statistics[0].shots.total ?? 0,
  }));

  const colors = ["#58A6FF", "#B388F8"];

  return (
    <CardShell
      title="SHOT COMPARE"
      isLoading={isLoading}
      dataUpdatedAt={dataUpdatedAt}
    >
      {players.length < 2 ? (
        <p className="text-text-muted text-xs text-center py-4">
          Click two players from the leaderboards to compare shots
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={chartData} layout="vertical" barSize={16}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fill: "#E6EDF3", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="shots" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </CardShell>
  );
}
