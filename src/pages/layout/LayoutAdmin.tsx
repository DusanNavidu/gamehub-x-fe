import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminPanel from "../headers/AdminPanel";
import { useAuth } from "../../context/authContext";
import { LogOut, Menu, ShieldCheck } from "lucide-react";

export default function LayoutAdmin() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-mono selection:bg-green-500/30">
      
      {/* Background Grid Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      {/* Sidebar component */}
      <AdminPanel isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen relative z-10 transition-all duration-300">
        
        {/* Topbar */}
        <header className="sticky top-0 h-16 bg-black/80 backdrop-blur-md border-b border-green-500/20 flex items-center justify-between px-4 sm:px-8 z-30">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-sm sm:text-base font-bold text-gray-200 tracking-widest hidden sm:block">
              ADMIN <span className="text-green-500">OVERRIDE</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400 tracking-wider font-bold hidden sm:inline">
                {user?.fullName || "COMMANDER"}
              </span>
            </div>
            
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-red-400 transition-colors uppercase font-bold group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Abort Link</span>
            </button>
          </div>
        </header>

        {/* Dynamic Pages Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}