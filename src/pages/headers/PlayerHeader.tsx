import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext"; // Path එක හරියට හදාගන්න
import { Gamepad2, LogOut, User } from "lucide-react";

export default function PlayerHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#0a0a0a] border-b border-green-500/20 py-4 px-4 sm:px-10 flex items-center justify-between font-mono sticky top-0 z-50 shadow-md shadow-green-500/5">
      {/* Logo / Brand */}
      <Link to="/player/dashboard" className="flex items-center gap-3 group transition-transform hover:scale-105">
        <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/30 group-hover:border-green-500 transition-colors">
          <Gamepad2 className="w-6 h-6 text-green-500" />
        </div>
        <h1 className="text-xl font-bold tracking-widest uppercase text-white">
          Player_<span className="text-green-500">Nexus</span>
        </h1>
      </Link>

      {/* User Info & Logout */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden sm:flex items-center gap-2 bg-[#111] border border-green-500/20 px-3 py-1.5 rounded text-gray-400">
          <User className="w-4 h-4 text-green-500" />
          <span className="text-sm uppercase tracking-wide">{user?.name || "GUEST_USER"}</span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-xs text-red-500 border border-red-500/30 px-3 py-2 rounded hover:bg-red-500/10 hover:border-red-500 transition-all uppercase font-bold tracking-wider"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">LOGOUT_SESSION</span>
        </button>
      </div>
    </header>
  );
}