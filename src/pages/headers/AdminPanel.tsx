import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, UploadCloud, Settings, Gamepad2, X } from "lucide-react";

interface AdminPanelProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function AdminPanel({ isOpen, setIsOpen }: AdminPanelProps) {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Player Logs", path: "/admin/players", icon: <Users className="w-5 h-5" /> },
    { name: "Upload Protocol", path: "/admin/upload", icon: <UploadCloud className="w-5 h-5" /> },
    { name: "Category Manager", path: "/admin/categories", icon: <Gamepad2 className="w-5 h-5" /> },
    { name: "System Settings", path: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Dark Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen w-64 bg-[#050505] border-r border-green-500/20 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header (Logo) */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-green-500/20 shrink-0">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-green-500 animate-pulse" />
            <h2 className="text-xl font-black text-white tracking-widest">
              NEXUS<span className="text-green-500">_OS</span>
            </h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-green-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Links */}
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 pl-2">Core Systems</p>
          
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)} 
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-green-500/20 bg-green-900/10 shrink-0">
          <p className="text-[10px] text-center text-green-500/50 font-mono tracking-widest">
            GameHub-X © 2026<br/>Secure Terminal
          </p>
        </div>
      </aside>
    </>
  );
}