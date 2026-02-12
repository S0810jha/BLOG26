Perfect 👍
Here’s a **clean, professional, copy-paste ready `README.md`** for your project. I’ve formatted it properly for GitHub with emojis, headings, and code blocks.

---


# BLOG26 – Full Stack Blog Application 📝

A modern, real-time blog platform built with the **MERN stack** (MongoDB, Express.js, React, Node.js).  
It features **role-based access** for Admin and Users, **real-time updates** using Socket.IO, and a sleek, responsive UI.

---

## ✨ Features

### 👑 Admin Panel
- Secure admin login using **JWT**
- Dashboard with key metrics:
  - Total posts
  - Views
  - Likes
  - Registered users
- Create, Read, Update, Delete (**CRUD**) blog posts
- Upload featured images (**Cloudinary integration**)
- Moderate comments (delete inappropriate ones)
- View all posts with **infinite scroll & filters**
- **Real-time updates** for:
  - New post
  - Post edit
  - Post delete
  - Likes & comments

---

### 👤 User Section
- User **Register / Login** with JWT authentication
- Browse blog posts with **infinite scrolling**
- Search posts by title & filter by category
- Read full blog posts with **unique view tracking**
- Like / Unlike posts with **live like count**
- Add & delete own comments (**real-time updates**)
- Fully **responsive design** (mobile, tablet, desktop)

---

### ⚡ Real-Time Capabilities
Powered by **Socket.IO** for instant updates:
- New blog published
- Blog updated or removed
- Likes toggled
- Views counted
- Comments added or deleted

---

## 🛠 Tech Stack

### Frontend
- React 18 + Vite
- React Router DOM v6
- Context API (state management)
- Tailwind CSS (custom UI)
- Axios
- Socket.IO Client
- Framer Motion (loading animations)
- React Toastify (notifications)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt (password hashing)
- Cloudinary (image upload)
- Multer (file handling)
- Socket.IO (real-time)
- Validator, CORS, Dotenv

---

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Cloudinary account (for image uploads)

---

## ⚙️ Environment Variables

### Backend (`/backend/.env`)
```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
````

### Frontend (`/frontend/.env`)

```env
VITE_BACKEND_URI=http://localhost:8080
```

---

## 🔧 Installation & Running

### Backend

```bash
cd backend
npm install
npm run server   # runs with nodemon
# OR
npm start        # runs with node
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Now open:

```
http://localhost:5173
```

(or the port shown by Vite)

---

## 📁 Project Structure (Simplified)

```text
backend/
├── config/          # Database & Cloudinary configs
├── controllers/     # Admin & User controllers
├── middlewares/     # Auth & Multer
├── models/          # Mongoose models
├── routes/          # Express routes
├── server.js        # Entry point
└── package.json

frontend/
├── src/
│   ├── components/  # Navbar, Sidebar, Spinner, Footer
│   ├── context/     # AdminContext, UserContext
│   ├── pages/       # Admin & User pages
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

---

## 📡 API Endpoints

### Admin Routes (`/api/admin`)

* `POST /login` – Admin login
* `POST /add-blog` – Create blog (auth + image)
* `GET /get-all-blogs` – Paginated blog list
* `POST /remove-blog` – Delete blog
* `GET /get-blog/:blogId` – Single blog details
* `POST /update-blog` – Update blog (image optional)
* `GET /get-dashdata` – Dashboard statistics
* `POST /delete-comment/:commentId` – Delete comment

### User Routes (`/api/user`)

* `POST /register` – User registration
* `POST /login` – User login
* `GET /get-all-blogs` – Paginated blog feed
* `GET /get-blog/:blogId` – Blog details with likes & comments
* `GET /get-user` – Current user info
* `POST /like/:blogId` – Toggle like
* `POST /view/:blogId` – Record unique view
* `POST /add-comment/:blogId` – Add comment
* `POST /delete-comment/:commentId` – Delete own comment

---

## 🌐 Real-Time Events (Socket.IO)

### Server → Client

* `new-blog-added`
* `blog-updated`
* `blog-removed`
* `update-likes`
* `update-views`
* `new-comment`
* `comment-deleted`

### Client → Server

* `new_post` (used for broadcasting)

---

## 🚢 Deployment

### Backend

Deploy on **Render**

### Frontend

```bash
npm run build
```

Deploy on **Vercel**.
Set:

```env
VITE_BACKEND_URI=https://your-backend-url
```

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 🙌 Acknowledgements

* Built by **Shubham Jhan**
* Icons from **Lucide**
* Real-time magic powered by **Socket.IO**
