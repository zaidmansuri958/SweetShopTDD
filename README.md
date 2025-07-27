# 🍬 Sweet Shop Management System

A full-stack Sweet Shop Management System where:

- Users can register, log in, browse sweets, and access their dashboard.
- Admins can manage the inventory via an admin panel.
- Developed using **React**, **Node.js**, **Express**, and **MongoDB Atlas**.
- Built using **Test-Driven Development (TDD)** with **Jest** for both backend and frontend testing.

---

## 🛠 Tech Stack

### Frontend:
- React
- React Router DOM
- Axios
- Jest (React Testing Library)
- CSS (Dark Theme UI)

### Backend:
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (Authentication)
- Bcrypt (Password hashing)
- Jest + Supertest (for TDD)

---

## 🗂 Folder Structure

### Backend (`/backend`)
```
backend/
├── src/
│ ├── config/ # MongoDB connection config
│ ├── controllers/ # Logic for API routes
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Route endpoints
│ ├── middlewares/ # Auth, error handling
│ ├── tests/ # Jest + Supertest test files
│ └── index.js # Entry point
├── .env # Environment variables
└── package.json
```
### Frontend (`/sweetfrontend`)
```
sweetfrontend/
├── public/
├── src/
│ ├── assets/ # Images and static assets
│ │ └── sweet-hero.jpg
│ ├── components/ # Reusable components (Navbar, Footer, etc.)
│ ├── pages/ # Views (Dashboard, AdminPanel, Login, etc.)
│ ├── tests/ # Jest test files for components/pages
│ ├── App.css # Styles
│ └── App.jsx # Root component
├── .env # API base URL
└── package.json
```


---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sweet-shop.git
cd sweet-shop
```
## Backend setup
```bash
cd backend
npm install
npm start
```
## Environment Variable

```bash
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
```

## Test
``` bash
npm test
```

### Frontend Setup

```
cd ../sweetfrontend
npm install
npm start
```

## Run Frontend Tests

```
npm test

```


# 👉 Features

 ✅ Authentication
 
 ✅ User and Admin login with JWT
 
 ✅ Protected Routes with Role-based Access
 
 ✅ User Dashboard

 ✅ View sweets
 
 ✅ Search sweets
 
 ✅ Add to cart (WIP)
 
 ✅ Checkout (Upcoming)
 

# 🛠 Admin Panel
✅ Add/Edit/Delete sweets

✅ Manage inventory

# 🧪 Test-Driven Development (TDD)
This project follows a strict TDD workflow. Every feature begins with writing test cases using Jest and then implementing the code to pass those tests.

# 📸 ScreenShots

![Sweet Shop Screenshot](https://github.com/zaidmansuri958/SweetShopTDD/blob/a46b071de0001ceeb5408d7c044371b18348a324/Images/image%20(1).png)

![Sweet Shop Screenshot](https://github.com/zaidmansuri958/SweetShopTDD/blob/a46b071de0001ceeb5408d7c044371b18348a324/Images/image%20(6).png)

![Sweet Shop Screenshot](https://github.com/zaidmansuri958/SweetShopTDD/blob/a46b071de0001ceeb5408d7c044371b18348a324/Images/image%20(5).png)

![Sweet Shop Screenshot](https://github.com/zaidmansuri958/SweetShopTDD/blob/a46b071de0001ceeb5408d7c044371b18348a324/Images/image%20(3).png)

![Sweet Shop Screenshot](https://github.com/zaidmansuri958/SweetShopTDD/blob/a46b071de0001ceeb5408d7c044371b18348a324/Images/image%20(4).png)

![Sweet Shop Screenshot](https://github.com/zaidmansuri958/SweetShopTDD/blob/a46b071de0001ceeb5408d7c044371b18348a324/Images/image%20(2).png)






