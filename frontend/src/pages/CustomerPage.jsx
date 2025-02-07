import React, { useState, useEffect } from "react";

const CustomerPage = () => {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ title: "" });
  const [note, setNote] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNotes, setShowNotes] = useState(null); // New state to handle notes visibility

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`${backend_url}/api/customer/tickets`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch tickets");
      
      const data = await response.json(); // Extract JSON data
      setTickets(data || []); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching tickets", error);
      setTickets([]); // Prevents tickets from being undefined
    }
  };

  const handleCreateTicket = async () => {
    try {
      const response = await fetch(`${backend_url}/api/tickets`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTicket),
      });

      if (!response.ok) throw new Error("Failed to create ticket");

      const createdTicket = await response.json();
      setTickets([createdTicket, ...tickets]);
      setNewTicket({ title: "" });
    } catch (error) {
      console.error("Error creating ticket", error);
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
        body: JSON.stringify({ text: note, addedBy: "Customer" }),
      });

      if (!response.ok) throw new Error("Failed to add note");

      await fetchTickets();
      setNote("");
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error adding note", error);
    }
  };

  // Toggle to show/hide notes for a ticket
  const toggleNotes = (ticketId) => {
    setShowNotes((prevState) => (prevState === ticketId ? null : ticketId));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Customer Support</h1>

      {/* Create New Ticket */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3">Submit New Ticket</h2>
        <input
          type="text"
          placeholder="Enter issue title"
          value={newTicket.title}
          onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
          className="w-full p-2 border rounded-md mb-3"
        />
        <button
          onClick={handleCreateTicket}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Submit Ticket
        </button>
      </div>

      {/* List of Tickets */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Your Tickets</h2>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket._id} className="bg-gray-100 p-4 rounded-lg mb-4 shadow">
              <p className="text-lg font-semibold">{ticket.title}</p>
              <button
                onClick={() => setSelectedTicket(ticket._id)}
                className="text-blue-500 mt-2 underline"
              >
                Add Note
              </button>

              {/* Show Notes Button */}
              <button
                onClick={() => toggleNotes(ticket._id)}
                className="text-blue-500 mt-2 ml-4 underline"
              >
                {showNotes === ticket._id ? "Hide Notes" : "Show Notes"}
              </button>

              {/* Display Notes */}
              {showNotes === ticket._id && ticket.notes && ticket.notes.length > 0 && (
                <div className="mt-3">
                  {ticket.notes.map((note) => (
                    <div key={note._id} className="border-t pt-2">
                      <p className="text-sm text-gray-700"><strong>{note.addedBy}:</strong> {note.text}</p>
                      <p className="text-xs text-gray-500">{new Date(note.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Note Section */}
              {selectedTicket === ticket._id && (
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
            </div>
          ))
        ) : (
          <p className="text-gray-500">No tickets found.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;
