import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Customer', 'Agent', 'Admin'], default: 'Customer' },
});
const User = mongoose.model('User', userSchema);


const allowedOrigins = [
  "http://localhost:5173",
  "https://help-desk-bfld.onrender.com",
  "https://help-desk-1-r2rl.onrender.com" ,
   "https://help-desk-10ycdjlcs-mantina-sagars-projects.vercel.app"
];


app.use(cors({
  origin: allowedOrigins, 
  credentials: true,      
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
}));


const ticketSchema = new mongoose.Schema({
  title: String,
  status: { type: String, enum: ['Active', 'Pending', 'Closed'], default: 'Active' },
  customerName: String,
  lastUpdatedOn: { type: Date, default: Date.now },
  notes: [{
    text: String,
    addedBy: String,
    timestamp: { type: Date, default: Date.now },
    attachment: String,
  }],
});
const Ticket = mongoose.model('Ticket', ticketSchema);

app.post('/api/register', (async (req, res) => {
  
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, role });
  await user.save();
  res.status(201).json({ message: 'User registered successfully' });
}));

app.post('/api/login', (async (req, res) => {
  console.log(req.body);
  const { name, password } = req.body;

  const user = await User.findOne({ name });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  res.cookie("username", name, {
    httpOnly: false,    // Make cookie accessible to frontend
    secure: process.env.NODE_ENV === "production", // Set true in production
    sameSite: "Lax",    // SameSite policy to prevent CSRF
  });

  res.json({ message: 'Login successful', user: { id: user._id, name: user.name, role: user.role } });
}));

app.post('/api/tickets', (async (req, res) => {
  const customerName = req.cookies.username;
  console.log(customerName);
  const { title} = req.body;
  const ticket = new Ticket({ title, customerName });
  await ticket.save();
  res.status(201).json(ticket);
}));

app.get("/api/all/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ lastUpdatedOn: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tickets" });
  }
});

app.get("/api/customer/tickets", async (req, res) => {
  try {
    const username = req.cookies.username;
    console.log(username);
    const tickets = await Ticket.find({ customerName: username }).sort({ lastUpdatedOn: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tickets" });
  }
});
app.put("/api/tickets/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(id, { status, lastUpdatedOn: new Date() }, { new: true });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error updating ticket status" });
  }
});

app.post("/api/tickets/:id/notes", async (req, res) => {
  try {
    const { id } = req.params;
    let user_name = req.cookies.username;
    
    // Check if user_name is available (logged in)
    if (!user_name) {
      return res.status(401).json({ error: "User not logged in" });
    }

    const { text, addedBy = user_name, attachment } = req.body;
    const ticket = await Ticket.findById(id);

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    ticket.notes.push({ text, addedBy, attachment, timestamp: new Date() });
    ticket.lastUpdatedOn = new Date();
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error adding note" });
  }
});




app.get("/api/tickets/stats", async (req, res) => {
  try {
    const activeCount = await Ticket.countDocuments({ status: "Active" });
    const pendingCount = await Ticket.countDocuments({ status: "Pending" });
    const closedCount = await Ticket.countDocuments({ status: "Closed" });

    res.json({ Active: activeCount, Pending: pendingCount, Closed: closedCount });
  } catch (error) {
    res.status(500).json({ error: "Error fetching ticket stats" });
  }
});


app.get("/logout" , async (req, res) => {
  try {
    res.clearCookie("username");
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    res.status(500).json({ error: "Error logging out user" });
  }
})

app.get("/api/role_check", async (req, res) => {
  try {
    const username = req.cookies.username;
  

    if (username) {
      const existingUser = await User.findOne({ name: username });

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

     
      res.status(200).json({ message: "User logged in", role: existingUser.role });
    } else {
      res.status(200).json({ message: "User not logged in" });
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ error: "Error fetching user role" });
  }
});


app.post("/api/create_user", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const newUser = new User({ name, email, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

app.put("/api/update_users/:id", async (req, res) => {
  try {
    const { role } = req.body;
    const id= req.params.id;
    console.log(role);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = role;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
});

app.post("/api/delete_users", async (req, res) => {
  try {
    const {user_id} = req.body;

    const user_account = await User.findById(user_id);
    await User.findByIdAndDelete(user_account.id);

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});


app.get("/api/users/stats", async (req, res) => {
  try {
    const customers = await User.countDocuments({ role: "Customer" });
    const agents = await User.countDocuments({ role: "Agent" });
    const admins = await User.countDocuments({ role: "Admin" });

    res.json({ Customers: customers, Agents: agents, Admins: admins });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user stats" });
  }
});

app.get("/api/tickets/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error fetching ticket" });
  }
});

app.get("/api/all/users", async (req, res) => {
  try {
    // const users = await User.find({role : "Customer" || "Agent"});
    const users = await User.find();
    res.status(200).json({ users });
   
  }
catch (error) {
  res.status(500).json({ error: "Error fetching tickets" });
}
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
