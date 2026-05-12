<div align="center">
  <h1 align="center">Hostel Management System</h1>
  <p align="center">
    A comprehensive, full-stack MERN web application to streamline hostel administration, manage student accommodations, handle complaints, and process leave requests.
  </p>
</div>

<br />

## 📖 Project Overview

The **Hostel Management System** is a modern, responsive web application designed to digitize and automate the day-to-day operations of a hostel or dormitory. It bridges the gap between students and hostel administrators by providing dedicated portals for both. Students can easily log complaints, apply for leaves, and view their room assignments. Administrators get a bird's-eye view of the entire facility, enabling them to efficiently manage rooms, resolve student issues, process leave applications, and generate detailed PDF reports.

---

## ✨ Features

- 🔐 **Authentication:** Secure JWT-based login and registration for Students and Admins.
- 👨‍🎓 **Student Dashboard:** Personalized overview of room status, pending dues, active leaves, and open complaints.
- 👨‍💼 **Admin Dashboard:** Centralized metrics displaying total students, room occupancy, and pending administrative tasks.
- 🛏️ **Room Management:** Admins can view, allocate, and manage room capacities and occupancies across different blocks.
- 🛠️ **Complaint Management:** Students can log maintenance issues (Electricity, Water, etc.); Admins can track, update statuses (Pending/In Progress/Resolved), and add resolution notes.
- 📅 **Leave Request System:** Students can apply for leave with dates and destinations. Admins can approve or reject these requests with remarks.
- 🔍 **Search & Filters:** Easily search for specific students, filter rooms by availability, and sort complaints or leaves.
- 🌙 **Dark Mode:** A seamless, system-aware dark/light theme toggle for better user experience.
- 📄 **PDF Reports:** One-click generation of beautifully formatted PDF documents for student profiles, complaint logs, leave receipts, and bulk admin reports (Roster, Occupancy).

---

## 💻 Tech Stack

**Frontend**
- [React.js](https://reactjs.org/) (v19)
- [Vite](https://vitejs.dev/) (Build Tool)
- [Tailwind CSS](https://tailwindcss.com/) (v4 - Styling & UI)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) (Client-side PDF Generation)

**Backend**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens (JWT)](https://jwt.io/) (Authentication)
- [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) (Password Hashing)
- [Cloudinary](https://cloudinary.com/) (Image Storage)
- [Multer](https://github.com/expressjs/multer) (File Uploads)

---

## 📂 Folder Structure

\`\`\`text
sidlabproject/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/         # Static images and icons
│   │   ├── components/     # Reusable UI components (Navbar, Sidebar, etc.)
│   │   ├── context/        # React Context (AuthContext, ThemeContext)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Page layouts (AdminLayout, StudentLayout)
│   │   ├── pages/          # Application views/pages
│   │   ├── services/       # API call definitions (Axios)
│   │   └── utils/          # Helper functions (PDF Generator, Toast notifications)
│   ├── package.json
│   └── vite.config.js
│
└── server/                 # Backend (Node.js + Express)
    ├── config/             # Database connection setup
    ├── controllers/        # Route logic and request handling
    ├── middleware/         # Custom middleware (Auth, Error handling)
    ├── models/             # Mongoose Database Schemas
    ├── routes/             # Express API Route definitions
    ├── utils/              # Helper utilities (Cloudinary setup)
    ├── server.js           # Entry point for the backend
    └── package.json
\`\`\`

---

## 🚀 Installation Steps

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v16 or higher)
- A [MongoDB URI](https://www.mongodb.com/cloud/atlas) (Local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account for image storage

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/Kushal9753/Hostel-Management-System.git
cd sidlabproject
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd client
npm install
\`\`\`

---

## 🔑 Environment Variables

### Server ( \`server/.env\` )
Create a \`.env\` file in the \`server\` directory:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

### Client ( \`client/.env\` )
Create a \`.env\` file in the \`client\` directory:
\`\`\`env
VITE_API_URL=http://localhost:5000
\`\`\`

---

## ⚡ Running the Application

**Start the Backend Server:**
\`\`\`bash
cd server
npm run dev
\`\`\`
*(Runs on http://localhost:5000)*

**Start the Frontend Server:**
\`\`\`bash
cd client
npm run dev
\`\`\`
*(Runs on http://localhost:5173)*

---

## 📡 API Routes

| HTTP Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | \`/api/auth/register\` | Register a new student | Public |
| **POST** | \`/api/auth/login\` | Authenticate user & get token | Public |
| **GET** | \`/api/auth/me\` | Get current logged in user | Private |
| **GET** | \`/api/students/dashboard\`| Get student dashboard stats | Student |
| **GET** | \`/api/admin/dashboard\` | Get admin dashboard stats | Admin |
| **GET** | \`/api/rooms/my-room\` | Get student's allocated room | Student |
| **GET** | \`/api/complaints/my\` | Get student's complaints | Student |
| **POST** | \`/api/complaints\` | Create a new complaint | Student |
| **PUT** | \`/api/complaints/:id\` | Update complaint status | Admin |
| **GET** | \`/api/leaves/my-leaves\` | Get student's leave requests | Student |
| **POST** | \`/api/leaves\` | Submit a new leave request | Student |
| **PUT** | \`/api/leaves/:id\` | Approve/Reject leave | Admin |

*(Note: This is a summary. Additional CRUD routes exist for Rooms, Users, and Admin management).*

---

## 🌐 Deployment Guide

### Backend (Render, Heroku, etc.)
1. Set the Node environment variable: \`NODE_ENV=production\`
2. Add all Server environment variables (\`MONGO_URI\`, \`JWT_SECRET\`, \`CLOUDINARY_*\`) to your hosting provider's dashboard.
3. Build command: \`npm install\`
4. Start command: \`npm start\`

### Frontend (Vercel, Netlify, etc.)
1. Add the Client environment variable: \`VITE_API_URL=https://your-deployed-backend-url.com\`
2. Build command: \`npm run build\`
3. Output directory: \`dist\`
4. **Important:** Add a rewrite rule for Single Page Applications (SPA) so that all routes point to \`index.html\`.

---

## 🔮 Future Improvements

- **Payment Gateway Integration:** Implement Stripe/Razorpay for processing online hostel fee payments and tracking dues.
- **Automated Notifications:** Integrate email (Nodemailer) or SMS alerts for leave approvals and complaint status changes.
- **Notice Board System:** Create an admin-controlled digital notice board for global hostel announcements.
- **Staff Management Module:** Extend the system to manage hostel staff (wardens, cleaning staff, maintenance).
- **Mess/Canteen Management:** Add a module for managing daily meal menus, attendance, and dietary preferences.

---

## 👤 Author

Developed with ❤️ by **Kushal Sahu**.

- GitHub: [@kushalsahu](https://github.com/kushalsahu)
- Portfolio: [Your Portfolio Link](#)
- LinkedIn: [Your LinkedIn Profile](#)

---
<div align="center">
  <i>If you found this project helpful, please consider giving it a ⭐ on GitHub!</i>
</div>
