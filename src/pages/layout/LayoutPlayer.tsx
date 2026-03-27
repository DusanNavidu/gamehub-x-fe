import { Outlet } from "react-router-dom";
import PlayerHeader from "../headers/PlayerHeader"; // Path එක හරියට හදාගන්න

export default function LayoutPlayer() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col selection:bg-green-500/30">
      {/* හැම පිටුවකම පේන Header එක */}
      <PlayerHeader />

      {/* Child routes (PlayerDashboard, GameDashboard වගේ දේවල්) render වෙන්නේ මෙතන */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}