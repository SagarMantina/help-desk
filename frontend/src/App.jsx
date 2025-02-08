import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import CustomerPage from "./pages/CustomerPage";
import AgentPage from "./pages/AgentPage";
import HomePage from "./pages/HomePage";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [loading, setLoading] = useState(false); // No need to wait for API fetch

  // Commented out API fetch since we're using localStorage instead
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await fetch(`${backend_url}/api/role_check`, {
  //         method: "GET",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       const data = await res.json();
  //       console.log("Fetched Role Data:", data);

  //       if (res.status === 200 && data.role) {
  //         setRole(data.role);
  //         localStorage.setItem("role", data.role);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching user role:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  const redirectToRolePage = () => {
    if (role === "Admin") return "/admin";
    if (role === "Customer") return "/customer";
    if (role === "Agent") return "/agent";
    return "/login";
  };

  return (
    <Router>
      <div className="min-h-screen flex">
        <div className="p-4 flex-1">
          <Routes>
            <Route path="/login" element={<LoginPage setUser={setRole} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/dashboard" element={<Navigate to={role ? redirectToRolePage() : "/home"} />} />
            {role === "Admin" && <Route path="/admin" element={<AdminPage />} />}
            {role === "Customer" && <Route path="/customer" element={<CustomerPage />} />}
            {role === "Agent" && <Route path="/agent" element={<AgentPage />} />}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
