import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import PrivateRoute from "./utility/PrivateRoute";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import "./App.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // shared sidebar state
  const [message, setMessage] = useState("Loading...");

useEffect(() => {
    fetch("http://127.0.0.1:8000/ATTN_Backend/web_desc/")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setMessage(JSON.stringify(data.recipes, null, 2)))
      .catch(() => setMessage("Failed to load recipes."));
  }, []);
    
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Protected route with Sidebar and. Topbar */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div className="bg-gray-50 min-h-screen flex flex-col">
                {/* Sidebar */}
                  <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                {/* Main Content Area */} 
                <main
                  className="
                    flex-1 
                    transition-all duration-300
                    lg:ml-72
                  "
                >
                  {/* Topbar */}
                  <div className="sticky top-0 bg-white shadow-sm">
                  <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                  </div>

                  {/* Page content (Dashboard) */}
                  <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10">
                    <Dashboard />
                  </div>
                </main>
              </div>

              
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
