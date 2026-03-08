import { io } from "socket.io-client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Home, Auth, Orders, Tables, Menu, Dashboard, Inventory } from "./pages";
import Sidebar from "./components/layout/Sidebar";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader"

function Layout() {
  const isLoading = useLoadData();
  const location = useLocation();
  const hideSidebarRoutes = ["/auth"];
  const { isAuth } = useSelector(state => state.user);

  if(isLoading) return <FullScreenLoader />

  const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen bg-[#141414] text-slate-800 font-sans overflow-hidden">
      {showSidebar && <Sidebar />}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Routes>
          <Route path="/" element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
          <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
          <Route path="/orders" element={<ProtectedRoutes><Orders /></ProtectedRoutes>} />
          <Route path="/tables" element={<ProtectedRoutes><Tables /></ProtectedRoutes>} />
          <Route path="/menu" element={<ProtectedRoutes><Menu /></ProtectedRoutes>} />
          <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
          <Route path="/inventory" element={<ProtectedRoutes><Inventory /></ProtectedRoutes>} />
          <Route path="*" element={<div className="p-10 font-bold text-xl">Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" />;
  }
  return children;
}

function App() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("newOrder", () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    });
    socket.on("orderUpdated", () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    });
    return () => socket.disconnect();
  }, [queryClient]);
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
