import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
const backend_url = "https://help-desk-bfld.onrender.com" || "http://localhost:5000";
const LoginPage = ({ setUser }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS animations
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
 
  const navigate = useNavigate(); 
    try {
      const res = await fetch(`${backend_url}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      if(res.status === 200) {
        setUser(data.role);
        console.log(data.user.role);
        console.log("redirecting");
        navigate("/");
      }
      else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div 
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md" 
        data-aos="fade-up"
      >
        <h2 className="text-2xl font-bold text-center" data-aos="fade-down">
          Welcome to Help Desk
        </h2>
        <p className="text-xl text-center text-gray-600" data-aos="fade-up">
          Your support is just a login away.
        </p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              data-aos="fade-up"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-aos="fade-up"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
            data-aos="zoom-in"
          >
            Login
          </button>
        </form>
        <p className="mt-3 text-sm text-center" data-aos="fade-up">
          Don't have an account? <a href="/register" className="text-blue-600">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
