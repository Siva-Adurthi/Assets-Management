export default function StatusBadge({ value }) {
  const cls = value?.toLowerCase().replaceAll(" ", "-") || "unknown";
  return <span className={`status-badge ${cls}`}>{value}</span>;
}
