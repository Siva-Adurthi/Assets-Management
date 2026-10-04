import { Box, CheckCircle2, Wrench, Activity } from "lucide-react";

const icons = { total: Box, available: CheckCircle2, inUse: Activity, maintenance: Wrench };

export default function StatCard({ label, value, type }) {
  const Icon = icons[type] || Box;
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-icon"><Icon size={20}/></div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
