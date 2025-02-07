import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS animations
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", { name, email, password, role });
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div 
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
        data-aos="fade-up"
      >
        <h2 className="text-2xl font-bold text-center" data-aos="fade-down">
          Register
        </h2>
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
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="mb-3">
            <label className="block text-sm font-medium">Role</label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              data-aos="fade-up"
            >
              <option value="Customer">Customer</option>
              <option value="Agent">Customer Service Agent</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring focus:ring-green-300 shadow-lg"
            data-aos="zoom-in"
          >
            Register
          </button>
        </form>
        <p className="mt-3 text-sm text-center" data-aos="fade-up">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
