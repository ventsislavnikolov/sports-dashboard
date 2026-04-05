import { useStore } from "@tanstack/react-store";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { PlayerMatchStat } from "@/api/types";
import { CardShell } from "@/shared/CardShell";
import { activeFixtureStore } from "@/store/activeFixture";

interface ShotCompareCardProps {
  allPlayers: PlayerMatchStat[];
  dataUpdatedAt: number;
  isLoading: boolean;
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
      dataUpdatedAt={dataUpdatedAt}
      isLoading={isLoading}
      title="SHOT COMPARE"
    >
      {players.length < 2 ? (
        <p className="py-4 text-center text-text-muted text-xs">
          Click two players from the leaderboards to compare shots
        </p>
      ) : (
        <ResponsiveContainer height={100} width="100%">
          <BarChart barSize={16} data={chartData} layout="vertical">
            <XAxis hide type="number" />
            <YAxis
              axisLine={false}
              dataKey="name"
              tick={{ fill: "#E6EDF3", fontSize: 11 }}
              tickLine={false}
              type="category"
              width={100}
            />
            <Bar dataKey="shots" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell fill={colors[index % colors.length]} key={index} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </CardShell>
  );
}
