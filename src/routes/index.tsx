import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/authContext";
import LayoutAdmin from "../pages/layout/LayoutAdmin";
import LayoutPlayer from "../pages/layout/LayoutPlayer";

// Pages
const Index = lazy(() => import("../pages/Index"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const PlayerDashboard = lazy(() => import("../pages/player/PlayerDashboard"));
const AdminCategory = lazy(() => import("../pages/admin/AdminCategories"));
const AdminUpload = lazy(() => import("../pages/admin/AdminUpload"));
const GameDashboard = lazy(() => import("../pages/player/GameDashboard"));

const GamingLoader = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0a] overflow-hidden relative selection:bg-green-500/30">
    <div className="relative flex items-center justify-center">
      <div className="w-24 h-24 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
      <div className="absolute w-12 h-12 border border-green-400/50 rounded-full flex items-center justify-center animate-pulse">
        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#22c55e]"></div>
      </div>
    </div>
    <h2 className="mt-8 text-green-500 font-mono font-bold tracking-[0.4em] uppercase animate-pulse shadow-green-500">
      INITIALIZING_
    </h2>
  </div>
);

type RequireAuthTypes = { children: ReactNode; roles?: string[] };

const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useAuth();

  if (loading) return <GamingLoader />;
  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0a] text-white font-mono">
        <h2 className="text-4xl text-red-500 font-bold mb-4">ACCESS DENIED</h2>
        <p className="text-gray-400">Low clearance level detected.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<GamingLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin"
            element={
              <RequireAuth roles={["ADMIN"]}>
                <LayoutAdmin />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="upload" element={<AdminUpload />} />
            <Route path="categories" element={<AdminCategory />} />
          </Route>

          <Route
            path="/player"
            element={
              <RequireAuth roles={["PLAYER"]}>
                <LayoutPlayer />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/player/dashboard" replace />} />
            <Route path="dashboard" element={<PlayerDashboard />} />
          </Route>

          <Route
            path="/player/play"
            element={
              <RequireAuth roles={["PLAYER"]}>
                <GameDashboard />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}