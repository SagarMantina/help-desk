
import React, { useState, useEffect } from "react";
const backend_url = "https://help-desk-bfld.onrender.com";
const AgentPage = () => {
  const [tickets, setTickets] = useState([]);
  const [note, setNote] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [toggleState, setToggleState] = useState({
    status: null, 
    note: null,
  });

  useEffect(() => {
    fetchTickets();
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

  const handleAddNote = async (id) => {
    try {
      const response = await fetch(`${backend_url}/api/tickets/${id}/notes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: note, addedBy: "Agent" }),
      });

      if (!response.ok) throw new Error("Failed to add note");

      const updatedTicket = await response.json();
      setTickets(tickets.map(ticket => ticket._id === updatedTicket._id ? updatedTicket : ticket));
      setNote("");
      setToggleState({ ...toggleState, note: null }); // Close note section
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
      setTickets(tickets.map(ticket => ticket._id === updatedTicket._id ? updatedTicket : ticket));
      setNewStatus(""); 
      setToggleState({ ...toggleState, status: null }); // Close status dropdown
    } catch (error) {
      console.error("Error updating ticket status", error);
    }
  };

  // Toggle Add Note Section
  const toggleNoteSection = (ticketId) => {
    setToggleState((prevState) => ({
      ...prevState,
      note: prevState.note === ticketId ? null : ticketId, // Toggle visibility
    }));
  };

  // Toggle Update Status Section
  const toggleStatusSection = (ticketId) => {
    setToggleState((prevState) => ({
      ...prevState,
      status: prevState.status === ticketId ? null : ticketId, // Toggle visibility
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Agent Support Dashboard</h1>

      {/* List of Tickets */}
      <div>
        <h2 className="text-xl font-semibold mb-3">All Tickets</h2>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket._id} className="bg-gray-100 p-4 rounded-lg mb-4 shadow">
              <p className="text-lg font-semibold">{ticket.title}</p>
              <p className="text-sm text-gray-600">Customer: {ticket.customerName}</p>
              <p className="text-sm text-gray-600">Status: {ticket.status}</p>

              {/* Show Update Status Button */}
              <button
                onClick={() => toggleStatusSection(ticket._id)}
                className="text-blue-500 mt-2 underline"
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

              {/* Add Note Button */}
              <button
                onClick={() => toggleNoteSection(ticket._id)}
                className="text-blue-500 mt-2 ml-4 underline"
              >
                Add Note
              </button>

              {/* Add Note Section */}
              {toggleState.note === ticket._id && (
                <div className="mt-3">
                  <textarea
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  ></textarea>
                  <button
                    onClick={() => handleAddNote(ticket._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-green-600"
                  >
                    Add Note
                  </button>
                </div>
              )}

              {/* Display Notes */}
              {ticket.notes && ticket.notes.length > 0 && (
                <div className="mt-3">
                  {ticket.notes.map((note) => (
                    <div key={note._id} className="border-t pt-2">
                      <p className="text-sm text-gray-700"><strong>{note.addedBy}:</strong> {note.text}</p>
                      <p className="text-xs text-gray-500">{new Date(note.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
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

export default AgentPage;
