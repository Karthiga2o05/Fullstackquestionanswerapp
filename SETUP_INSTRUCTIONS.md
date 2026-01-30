# XCyber Full-Stack Setup Instructions

Complete setup guide for running the XCyber Question-Answer Platform with both frontend and backend.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB** following the official guide for your OS
2. **Start MongoDB service**:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # MongoDB starts automatically as a service
   ```

3. **Verify MongoDB is running**:
   ```bash
   mongosh
   # You should see MongoDB shell prompt
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/xcyber`)
5. Update `.env` file in backend with your connection string

## 🚀 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your settings:
   ```env
   # For local MongoDB
   MONGODB_URI=mongodb://localhost:27017/xcyber
   
   # OR for MongoDB Atlas
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/xcyber
   
   JWT_SECRET=your_secure_random_string_here_change_this
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

### Step 4: Start Backend Server

**Development mode** (with auto-restart on file changes):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📍 Environment: development
🌐 API URL: http://localhost:5000
```

### Step 5: Test Backend API

Open a new terminal and test the health endpoint:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "XCyber API is running",
  "timestamp": "2024-01-30T..."
}
```

## 💻 Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **new terminal** (keep backend running) and navigate to the root directory:

```bash
cd ..  # If you're in backend folder
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file (should already have correct values):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Step 4: Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
  VITE v6.3.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## 🧪 Testing the Application

### Create an Admin Account

1. Go to `http://localhost:5173/register`
2. Fill in the form:
   - Username: Admin User
   - Email: admin@xcyber.com
   - Password: admin123
   - Role: **Admin**
3. Click Register

### Create a User Account

1. Logout (if logged in)
2. Go to `http://localhost:5173/register`
3. Fill in the form:
   - Username: Test User
   - Email: user@xcyber.com
   - Password: user123
   - Role: **User**
4. Click Register

### Test Admin Features

1. Login as admin (admin@xcyber.com / admin123)
2. You'll be redirected to `/admin`
3. Click "Add Question"
4. Create an MCQ question:
   - Question: What is 2+2?
   - Type: MCQ
   - Option A: 3
   - Option B: 4
   - Option C: 5
   - Option D: 6
   - Correct Answer: B
5. Click "Add Question"
6. Create a Fill-in-Blank question:
   - Question: The capital of France is ___
   - Type: Fill in the Blank
   - Correct Answer: Paris
7. Click "Add Question"

### Test User Features

1. Logout and login as user (user@xcyber.com / user123)
2. You'll be redirected to `/user`
3. You should see both questions
4. Answer each question
5. Click "Submit Answer"
6. You should see "Your answer has been submitted successfully!"

## 🔍 Troubleshooting

### Backend Won't Start

**Issue**: `Error connecting to MongoDB`
- **Solution**: Make sure MongoDB is running
  ```bash
  # Check MongoDB status
  mongosh
  ```

**Issue**: `Port 5000 already in use`
- **Solution**: Change port in `backend/.env`:
  ```env
  PORT=5001
  ```
  Then update frontend `.env`:
  ```env
  VITE_API_URL=http://localhost:5001/api
  ```

### Frontend Won't Connect to Backend

**Issue**: Network errors or CORS errors
- **Solution 1**: Ensure backend is running on port 5000
- **Solution 2**: Check `.env` file has correct `VITE_API_URL`
- **Solution 3**: Clear browser cache and restart dev server

### Authentication Issues

**Issue**: "Not authorized" or "Token failed"
- **Solution**: Clear browser localStorage:
  ```javascript
  // In browser console (F12)
  localStorage.clear();
  ```
  Then login again

### Database Errors

**Issue**: Duplicate key errors
- **Solution**: Drop the database and start fresh:
  ```bash
  mongosh
  > use xcyber
  > db.dropDatabase()
  ```

## 📁 Project Structure

```
xcyber/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Database & JWT config
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & role middleware
│   │   ├── routes/         # API routes
│   │   ├── app.js         # Express app
│   │   └── server.js      # Entry point
│   ├── .env               # Environment variables
│   └── package.json
│
└── src/                    # Frontend (React)
    ├── app/
    │   ├── components/     # React components
    │   ├── contexts/       # React contexts
    │   ├── services/       # API services
    │   └── App.tsx        # Main app component
    ├── .env               # Environment variables
    └── package.json

```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (Protected)

### Admin (Admin Only)
- `POST /api/admin/questions` - Create question
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question
- `GET /api/admin/dashboard` - Get stats

### Questions (Protected)
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get question by ID

### Answers (Protected)
- `POST /api/answers` - Submit answer
- `GET /api/answers` - Get my answers
- `GET /api/answers/:userId` - Get user answers

## 🔐 Default Accounts

After setup, you can create these accounts for testing:

**Admin Account:**
- Email: admin@xcyber.com
- Password: admin123
- Role: ADMIN

**User Account:**
- Email: user@xcyber.com
- Password: user123
- Role: USER

## 📦 Production Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Change `NODE_ENV=production`
3. Use a strong `JWT_SECRET`
4. Use MongoDB Atlas for database
5. Enable HTTPS
6. Set correct `FRONTEND_URL`

### Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting platform
3. Update `VITE_API_URL` to your production API URL

## 🆘 Getting Help

If you encounter issues:

1. Check the browser console (F12) for errors
2. Check backend terminal for error messages
3. Verify MongoDB is running
4. Ensure all environment variables are set correctly
5. Try clearing localStorage and cookies
6. Restart both backend and frontend servers

## ✅ Success Checklist

- [ ] MongoDB is installed and running
- [ ] Backend server starts without errors
- [ ] Frontend server starts and opens in browser
- [ ] Can register new admin account
- [ ] Can register new user account
- [ ] Admin can create questions
- [ ] Admin can edit questions
- [ ] Admin can delete questions
- [ ] User can view questions
- [ ] User can submit answers
- [ ] Answers persist in database

## 🎉 You're Ready!

Your XCyber platform is now fully functional with:
- ✅ Complete backend API with MongoDB
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Real-time data persistence
- ✅ Professional UI/UX

Happy coding! 🚀
