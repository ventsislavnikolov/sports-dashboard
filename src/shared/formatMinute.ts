export function formatMinute(
  elapsed: number | null,
  statusShort?: string
): string {
  if (elapsed === null) return "—";

  if (statusShort === "1H" && elapsed > 45) {
    return `45+${elapsed - 45}'`;
  }

  if (elapsed > 90) {
    return `90+${elapsed - 90}'`;
  }

  return `${elapsed}'`;
}
