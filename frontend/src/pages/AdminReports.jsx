import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AppShell from "../components/AppShell";
import { PageTitle } from "./FacultyDashboard";
import StatCard from "../components/StatCard";
import api from "../api";
import { errorMessage } from "../utils";

export default function AdminReports(){
  const [summary,setSummary]=useState({total:0,available:0,inUse:0,maintenance:0});
  const [chart,setChart]=useState([]);
  const [error,setError]=useState("");
  useEffect(()=>{Promise.all([api.get("/reports/summary"),api.get("/reports/category-distribution")]).then(([s,c])=>{setSummary(s.data);setChart(c.data)}).catch(e=>setError(errorMessage(e)))},[]);
  return <AppShell admin><PageTitle title="Asset Reports" subtitle="Overview of asset availability and category distribution."/>{error&&<div className="alert error">{error}</div>}<div className="stats-grid"><StatCard label="Total Assets" value={summary.total} type="total"/><StatCard label="Available" value={summary.available} type="available"/><StatCard label="In Use" value={summary.inUse} type="inUse"/><StatCard label="Maintenance" value={summary.maintenance} type="maintenance"/></div><div className="chart-card"><h2>Category Distribution</h2><div className="chart-wrap"><ResponsiveContainer width="100%" height={360}><BarChart data={chart}><CartesianGrid strokeDasharray="3 3" stroke="#252a30"/><XAxis dataKey="category" stroke="#9da4ad"/><YAxis stroke="#9da4ad"/><Tooltip/><Bar dataKey="count" fill="#ff6a00" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></div></AppShell>
}
