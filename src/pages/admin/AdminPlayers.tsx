import React, { useState, useEffect } from "react";
import { Users, Loader2, Power, PowerOff, Mail, ShieldAlert } from "lucide-react";
import { getAllPlayersProtocol, togglePlayerStatusProtocol } from "../../service/auth";
import { toast } from "react-toastify";

export default function AdminPlayers() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await getAllPlayersProtocol();
      setPlayers(res.data || []);
    } catch (error) {
      toast.error("Failed to load player data from Nexus.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await togglePlayerStatusProtocol(id);
      toast.success(
        `Player access ${currentStatus === 'ACTIVE' ? 'REVOKED' : 'GRANTED'} successfully.`
      );
      fetchPlayers(); // List එක refresh කරනවා
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to override player status.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-10 font-mono">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-white drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] flex items-center gap-3">
          <Users className="text-green-500 w-8 h-8" />
          OPERATIVE_DATABASE
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm tracking-widest mt-2 uppercase">
          Manage player network access and clearances
        </p>
      </div>

      <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] relative">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111] border-b border-gray-800 text-green-500 text-xs tracking-widest uppercase">
                <th className="p-5 font-bold">Designation (Name)</th>
                <th className="p-5 font-bold">Comms Link (Email)</th>
                <th className="p-5 font-bold text-center">Clearance</th>
                <th className="p-5 font-bold text-center">Network Status</th>
                <th className="p-5 font-bold text-right">Override Access</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                      <span className="text-green-500/70 uppercase tracking-widest text-xs animate-pulse">
                        Scanning Database...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : players.length > 0 ? (
                players.map((player) => (
                  <tr 
                    key={player._id} 
                    className={`border-b border-gray-800/50 transition-all ${player.status === 'INACTIVE' ? 'bg-red-900/5 opacity-75' : 'hover:bg-[#111]/80'}`}
                  >
                    <td className="p-5 font-bold text-white tracking-wide">
                      {player.fullName}
                    </td>
                    <td className="p-5 text-gray-400 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      {player.email}
                    </td>
                    <td className="p-5 text-center">
                      <span className="px-2 py-1 bg-gray-800/50 text-gray-400 border border-gray-700 rounded text-[10px] tracking-widest">
                        {player.role}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <span 
                        className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border ${
                          player.status === 'ACTIVE' 
                            ? 'bg-green-500/10 text-green-500 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                            : 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                        }`}
                      >
                        {player.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleToggleStatus(player._id, player.status)}
                        className={`p-2.5 rounded border transition-all hover:scale-105 active:scale-95 ${
                          player.status === 'ACTIVE' 
                            ? 'border-red-500/30 text-red-500 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                            : 'border-green-500/30 text-green-500 hover:bg-green-500/10 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                        }`}
                        title={player.status === 'ACTIVE' ? "Revoke Access" : "Grant Access"}
                      >
                        {player.status === 'ACTIVE' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500 flex flex-col items-center gap-2">
                    <ShieldAlert className="w-8 h-8 text-gray-600 mb-2" />
                    <span className="uppercase tracking-widest text-xs">NO_OPERATIVES_FOUND_IN_SYSTEM</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}