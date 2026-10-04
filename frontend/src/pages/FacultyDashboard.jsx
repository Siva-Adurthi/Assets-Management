import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import api from "../api";
import { errorMessage, formatDate } from "../utils";

export default function FacultyDashboard() {
  const [data, setData] = useState({assets:[], stats:{total:0,available:0,inUse:0,maintenance:0}});
  const [error,setError]=useState("");

  useEffect(() => {
    Promise.all([
      api.get("/assets"),
      api.get("/reports/summary").catch(()=>({data:{}}))
    ]).then(([assets, summary]) => {
      const s = summary.data || {};
      setData({
        assets: assets.data.assets.slice(0,5),
        stats: {
          total: assets.data.count || 0,
          available: s.available || assets.data.assets.filter(a=>a.assetStatus==="Available").length,
          inUse: s.inUse || assets.data.assets.filter(a=>a.assetStatus==="In Use").length,
          maintenance: s.maintenance || assets.data.assets.filter(a=>a.assetStatus==="Under Maintenance").length
        }
      });
    }).catch(err=>setError(errorMessage(err)));
  },[]);

  return (
    <AppShell>
      <PageTitle title="Faculty Dashboard" subtitle="View department assets and their current status."/>
      {error && <div className="alert error">{error}</div>}
      <div className="stats-grid">
        <StatCard label="Total Assets" value={data.stats.total} type="total"/>
        <StatCard label="Available" value={data.stats.available} type="available"/>
        <StatCard label="In Use" value={data.stats.inUse} type="inUse"/>
        <StatCard label="Under Maintenance" value={data.stats.maintenance} type="maintenance"/>
      </div>
      <div className="section-head"><div><h2>Recent Assets</h2><p>Latest assets in the portal.</p></div><Link to="/faculty/assets" className="linkish">View All</Link></div>
      <AssetTable assets={data.assets}/>
    </AppShell>
  );
}

export function PageTitle({title,subtitle,actions}) {
  return <div className="page-title"><div><h1>{title}</h1><p>{subtitle}</p></div>{actions && <div className="page-actions">{actions}</div>}</div>
}

export function AssetTable({assets, admin=false, onEdit, onDelete}) {
  return (
    <div className="table-card">
      <div className="table-scroll">
        <table>
          <thead><tr><th>Asset Name</th><th>Category</th><th>Status</th><th>Department</th><th>Asset Number</th>{admin&&<th>Action</th>}</tr></thead>
          <tbody>
            {assets.length ? assets.map(a=><tr key={a._id}>
              <td><strong>{a.assetName}</strong></td><td>{a.assetCategory}</td><td><StatusBadge value={a.assetStatus}/></td><td>{a.department}</td><td>{a.assetNumber}</td>
              {admin&&<td><div className="table-actions"><button onClick={()=>onEdit(a)} className="icon-action">✎</button><button onClick={()=>onDelete(a)} className="icon-action danger">⌫</button></div></td>}
            </tr>) : <tr><td colSpan={admin?6:5} className="empty">No assets found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
