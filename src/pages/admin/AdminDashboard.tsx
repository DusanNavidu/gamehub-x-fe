import React from "react";
import { Users, Gamepad2, Server, Activity, Terminal } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const trafficData = [
  { time: "Mon", players: 120 },
  { time: "Tue", players: 250 },
  { time: "Wed", players: 180 },
  { time: "Thu", players: 300 },
  { time: "Fri", players: 450 },
  { time: "Sat", players: 800 },
  { time: "Sun", players: 650 },
];

const recentLogs = [
  { id: 1, user: "John Wick", action: "User Login", time: "2 mins ago", status: "SUCCESS" },
  { id: 2, user: "System", action: "Protocol Update", time: "1 hour ago", status: "WARNING" },
  { id: 3, user: "Alex Neo", action: "Game Initiated", time: "3 hours ago", status: "SUCCESS" },
  { id: 4, user: "Unknown", action: "Invalid OTP", time: "5 hours ago", status: "FAILED" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-10">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-white drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] flex items-center gap-3">
          <Terminal className="text-green-500 w-8 h-8" />
          SYSTEM_NEXUS
        </h2>
        <p className="text-green-500/70 text-xs sm:text-sm tracking-widest uppercase mt-1">
          Real-time Server Analytics
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1 */}
        <div className="bg-black/50 border border-green-500/20 p-6 rounded-xl hover:border-green-500/50 transition-all group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">Total Operatives</p>
              <h3 className="text-3xl font-bold text-white">1,248</h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20 group-hover:bg-green-500/20 transition-all">
              <Users className="text-green-500 w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-green-400 mt-4 relative z-10">+12% from last week</p>
        </div>

        {/* Card 2 */}
        <div className="bg-black/50 border border-green-500/20 p-6 rounded-xl hover:border-green-500/50 transition-all group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">Active Modules</p>
              <h3 className="text-3xl font-bold text-white">24</h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20 group-hover:bg-green-500/20 transition-all">
              <Gamepad2 className="text-green-500 w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-green-400 mt-4 relative z-10">All systems operational</p>
        </div>

        {/* Card 3 */}
        <div className="bg-black/50 border border-green-500/20 p-6 rounded-xl hover:border-green-500/50 transition-all group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">Server Load</p>
              <h3 className="text-3xl font-bold text-white">34%</h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20 group-hover:bg-green-500/20 transition-all">
              <Server className="text-green-500 w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-green-400 mt-4 relative z-10">Optimal performance</p>
        </div>

        {/* Card 4 */}
        <div className="bg-black/50 border border-green-500/20 p-6 rounded-xl hover:border-green-500/50 transition-all group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">Network Ping</p>
              <h3 className="text-3xl font-bold text-white">12ms</h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20 group-hover:bg-green-500/20 transition-all">
              <Activity className="text-green-500 w-6 h-6 animate-pulse" />
            </div>
          </div>
          <p className="text-xs text-green-400 mt-4 relative z-10">Connection Stable</p>
        </div>
      </div>

      {/* Main Content Area (Chart + Logs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph Section */}
        <div className="lg:col-span-2 bg-black/50 border border-green-500/20 p-4 sm:p-6 rounded-xl relative overflow-hidden">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-green-500/20 pb-3">
            Traffic Analysis
          </h3>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#22c55e" opacity={0.1} vertical={false} />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px' }}
                  itemStyle={{ color: '#22c55e' }}
                />
                <Area type="monotone" dataKey="players" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorPlayers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Logs Section */}
        <div className="bg-black/50 border border-green-500/20 p-4 sm:p-6 rounded-xl flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-green-500/20 pb-3">
            Security Logs
          </h3>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-3 bg-[#050505] border border-gray-800 rounded-lg hover:border-green-500/30 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-white text-sm font-bold">{log.user}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border tracking-wider font-bold ${
                    log.status === 'SUCCESS' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 
                    log.status === 'WARNING' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' : 
                    'text-red-400 border-red-500/30 bg-red-500/10'
                  }`}>
                    {log.status}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-1">{log.action}</p>
                <p className="text-gray-600 text-[10px] uppercase">{log.time}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}