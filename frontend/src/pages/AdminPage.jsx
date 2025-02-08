import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
const backend_url = "https://help-desk-bfld.onrender.com";
const AdminPage = () => {
  const [tickets, setTickets] = useState([]);
  const [note, setNote] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [roleChanges, setRoleChanges] = useState({}); 
  const [toggleState, setToggleState] = useState({
    status: null,
    note: null,
  });

  useEffect(() => {
    fetchTickets();
    fetchUsers();
    fetchUserStats();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`${backend_url}/api/all/tickets`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch tickets");
      
      const data = await response.json();
      setTickets(data || []);
    } catch (error) {
      console.error("Error fetching tickets", error);
      setTickets([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${backend_url}/api/all/users`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${backend_url}/api/users/stats`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setUserStats(data || {});
    } catch (error) {
      console.error("Error fetching user stats", error);
    }
  };

  const handleAddNote = async (id) => {
    try {
      const response = await fetch(`${backend_url}/api/tickets/${id}/notes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: note, addedBy: "Admin" }),
      });

      if (!response.ok) throw new Error("Failed to add note");

      const updatedTicket = await response.json();
      setTickets(tickets.map((ticket) => ticket._id === updatedTicket._id ? updatedTicket : ticket));
      setNote("");
      setToggleState({ ...toggleState, note: null });
    } catch (error) {
      console.error("Error adding note", error);
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      const response = await fetch(`${backend_url}/api/tickets/${id}/status`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update ticket status");

      const updatedTicket = await response.json();
      setTickets(tickets.map((ticket) => ticket._id === updatedTicket._id ? updatedTicket : ticket));
      setNewStatus("");
      setToggleState({ ...toggleState, status: null });
    } catch (error) {
      console.error("Error updating ticket status", error);
    }
  };

  const handleUserRoleChange = async (id, role) => {
    try {
      if (!role || role === "choose") return; // Ensure the role is not empty or "choose"

      const response = await fetch(`${backend_url}/api/update_users/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) throw new Error("Failed to update user role");

      const updatedUser = await response.json();
      setUsers(users.map((user) => user._id === updatedUser._id ? updatedUser : user));
    } catch (error) {
      console.error("Error updating user role", error);
    }
  };

  const handleRoleChange = (id, role) => {
    setRoleChanges((prev) => ({
      ...prev,
      [id]: role,
    }));
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`${backend_url}/api/delete_users`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: id }),
      });

      if (!response.ok) throw new Error("Failed to delete user");

      const deletedUser = await response.json();
      setUsers(users.filter((user) => user._id !== deletedUser._id)); // Filter by _id, not name
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const toggleNoteSection = (ticketId) => {
    setToggleState((prevState) => ({
      ...prevState,
      note: prevState.note === ticketId ? null : ticketId,
    }));
  };

  const toggleStatusSection = (ticketId) => {
    setToggleState((prevState) => ({
      ...prevState,
      status: prevState.status === ticketId ? null : ticketId,
    }));
  };
  
  useEffect(() => {
    fetchTickets();
    fetchUsers();
    fetchUserStats();
    AOS.init(); // Initialize AOS
  }, []);

  return (
   
     <div className="w-full h-full">
       <div className="p-6 max-w-4xl mx-auto bg-blue-300">
    {/* Admin Dashboard */}
    <h1 className="text-3xl font-bold mb-6 text-center" data-aos="fade-up">
      Admin Dashboard
    </h1>

    {/* Dashboard Stats */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-100 p-4 rounded shadow" data-aos="fade-right">
        <p className="text-xl">Customers</p>
        <p className="text-lg font-semibold">{userStats.Customers}</p>
      </div>
      <div className="bg-green-100 p-4 rounded shadow" data-aos="fade-up">
        <p className="text-xl">Agents</p>
        <p className="text-lg font-semibold">{userStats.Agents}</p>
      </div>
      <div className="bg-yellow-100 p-4 rounded shadow" data-aos="fade-left">
        <p className="text-xl">Admins</p>
        <p className="text-lg font-semibold">{userStats.Admins}</p>
      </div>
    </div>

    {/* Users List */}
    <h2 className="text-xl font-semibold mb-3" data-aos="fade-up">
      Manage Users
    </h2>
    {users.length > 0 ? (
      users.map((user) => (
        <div key={user._id} className="bg-gray-100 p-4 rounded-lg mb-4 shadow" data-aos="zoom-in">
          <p className="text-lg font-semibold">{user.name}</p>
          <select
            value={roleChanges[user._id] || "choose"}
            onChange={(e) => handleRoleChange(user._id, e.target.value)}
            className="p-2 border rounded-md mb-2"
          >
            <option value="choose">Choose Role</option>
            <option value="Agent">Agent</option>
            <option value="Customer">Customer</option>
            <option value="Admin">Admin</option>
          </select>
          <p className="text-sm text-gray-500 mb-3">
            Select a role for this user from the dropdown.
          </p>
          <button
            onClick={() => handleUserRoleChange(user._id, roleChanges[user._id])}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-yellow-600"
          >
            Change Role
          </button>
          <button
            onClick={() => handleDeleteUser(user._id)}
            className="bg-red-500 text-white px-4 py-2 rounded-md ml-4 mt-2 hover:bg-red-600"
          >
            Delete User
          </button>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No users found.</p>
    )}

    {/* Ticket List */}
    <h2 className="text-xl font-semibold mb-3" data-aos="fade-up">
      Manage Tickets
    </h2>
    {tickets.length > 0 ? (
      tickets.map((ticket) => (
        <div key={ticket._id} className="bg-gray-100 p-4 rounded-lg mb-4 shadow" data-aos="fade-up">
          <p className="text-lg font-semibold">{ticket.title}</p>
          <p className="text-sm text-gray-600">Customer: {ticket.customerName}</p>
          <p className="text-sm text-gray-600">Status: {ticket.status}</p>

          {/* Update Status Button */}
          <button
            onClick={() => toggleStatusSection(ticket._id)}
            className="text-white mt-2 bg-green-400 p-2  hover:mouse-pointer mx-4 border rounded-md"
          >
            Update Status
          </button>

          {/* Status Dropdown */}
          {toggleState.status === ticket._id && (
            <div className="mt-2">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
              <button
                onClick={() => handleUpdateStatus(ticket._id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-yellow-600"
              >
                Update Status
              </button>
            </div>
          )}

          {/* Add Notes Button */}
          <button
            onClick={() => toggleNoteSection(ticket._id)}
            className="text-white mt-2  bg-pink-400 p-2  hover:mouse-pointer mx-4 border rounded-md"
          >
            Add Note
          </button>

          {/* Notes Section */}
          {toggleState.note === ticket._id && (
            <div className="mt-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
                placeholder="Add your note"
              ></textarea>
              <button
                onClick={() => handleAddNote(ticket._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Add Note
              </button>
            </div>
          )}
        </div>
      ))
    ) : (
      <p className="text-gray-500">No tickets found.</p>
    )}
     </div>
     </div>
   
  );
};

export default AdminPage;
