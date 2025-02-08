# Help Desk Pro

Help Desk Pro is a MERN stack-based help desk web application that allows users to create and manage support tickets. It features role-based access for customers, customer service agents, and administrators.

## Features

- **User Authentication:** Register and login with role-based access (Customer, Agent, Admin)
- **Ticket Management:** Customers can create tickets, and agents/admins can update and manage them
- **Notes on Tickets:** Users can add notes with timestamps and attachments
- **Role-Based Access Control:** Different permissions for Customers, Agents, and Admins
- **Dashboard Stats:** Admins can view ticket and user statistics
- **User Management:** Admins can create, update, and delete users
- **Logout Functionality:** Secure user session handling

## Tech Stack

- **Frontend:** React (Recommended)
- **Backend:** Express.js with TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** Cookie-based authentication with bcrypt.js
- **Deployment:** Render, Vercel

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB database (local or cloud-based, e.g., MongoDB Atlas)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/SagarMantina/help-desk.git
   cd help-desk-pro
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```

4. Start the server:
   ```sh
   npm start
   ```

5. The server will run at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login a user
- `GET /logout` - Logout user
- `GET /api/role_check` - Check user role

### Ticket Management
- `POST /api/tickets` - Create a new ticket
- `GET /api/all/tickets` - Get all tickets
- `GET /api/customer/tickets` - Get customer-specific tickets
- `PUT /api/tickets/:id/status` - Update ticket status
- `POST /api/tickets/:id/notes` - Add notes to a ticket
- `GET /api/tickets/:id` - Get a specific ticket

### User Management
- `POST /api/create_user` - Create a new user
- `PUT /api/update_users/:id` - Update user role
- `POST /api/delete_users` - Delete a user
- `GET /api/all/users` - Get all users
- `GET /api/users/stats` - Get user statistics

### Stats
- `GET /api/tickets/stats` - Get ticket statistics

## Deployment

The backend is deployed using Render, and the frontend is deployed using Vercel.

## Contributing

Feel free to submit pull requests or open issues for improvements and bug fixes.

## License

This project is licensed under the MIT License.
