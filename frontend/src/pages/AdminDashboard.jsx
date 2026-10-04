import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AppShell from "../components/AppShell";
import StatCard from "../components/StatCard";
import { PageTitle } from "./FacultyDashboard";
import api from "../api";
import { errorMessage } from "../utils";

export default function AdminDashboard(){
  const [summary,setSummary]=useState({total:0,available:0,inUse:0,maintenance:0});
  const [chart,setChart]=useState([]);
  const [error,setError]=useState("");

  useEffect(()=>{
    Promise.all([api.get("/reports/summary"),api.get("/reports/category-distribution")])
      .then(([s,c])=>{setSummary(s.data);setChart(c.data)})
      .catch(err=>setError(errorMessage(err)));
  },[]);

  return <AppShell admin>
    <PageTitle title="Admin Dashboard" subtitle="Manage assets, departments and reports."/>
    {error&&<div className="alert error">{error}</div>}
    <div className="stats-grid">
      <StatCard label="Total Assets" value={summary.total} type="total"/>
      <StatCard label="Available" value={summary.available} type="available"/>
      <StatCard label="In Use" value={summary.inUse} type="inUse"/>
      <StatCard label="Maintenance" value={summary.maintenance} type="maintenance"/>
    </div>
    <div className="chart-card"><div className="section-head"><div><h2>Asset Category Distribution</h2><p>Current number of assets in each category.</p></div><BarChart3/></div><div className="chart-wrap"><ResponsiveContainer width="100%" height={330}><BarChart data={chart}><CartesianGrid strokeDasharray="3 3" stroke="#252a30"/><XAxis dataKey="category" stroke="#9da4ad" tick={{fontSize:11}}/><YAxis stroke="#9da4ad"/><Tooltip contentStyle={{background:"#15191d",border:"1px solid #30363d",color:"#fff"}}/><Bar dataKey="count" fill="#ff6a00" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></div>
  </AppShell>
}
