# XCyber Production-Ready Setup Guide

Complete enterprise-level Bank & Insurance Exam Preparation Platform

## 🏢 Application Overview

**XCyber** is a professional question-answer platform designed for:
- LIC (Life Insurance Corporation)
- ICICI Bank
- SBI (State Bank of India)
- HDFC Bank
- Other banking and insurance exams

## 📊 Architecture

### Backend: Node.js + Express + MongoDB
- JWT Authentication
- Role-based Authorization (Admin/User)
- RESTful API
- MongoDB Collections: Admin, User, Section, Question, Answer

### Frontend: React SPA
- Professional Enterprise UI
- Role-based Routing
- Protected Routes
- Real-time API Integration

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB 5+
- npm/yarn

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

### 2. Frontend Setup

```bash
# In project root
npm install
cp .env.example .env
npm run dev
```

## 🔐 Admin Features

1. **Section Management**
   - Create sections (LIC, ICICI, SBI, HDFC, etc.)
   - Delete sections
   - View all sections

2. **Question Management**
   - Add MCQ questions
   - Add Fill-in-the-Blank questions
   - Edit questions
   - Delete questions
   - Organize by sections

3. **Dashboard Statistics**
   - Total sections
   - Total questions
   - Total users
   - Total answers

## 👤 User Features

1. **Section Selection**
   - View all available exam sections
   - Select section (LIC, ICICI, etc.)

2. **Question Answering**
   - Answer MCQ questions
   - Answer Fill-in-the-Blank questions
   - Submit responses
   - Track progress

3. **Results Tracking**
   - View submitted answers
   - Check correctness
   - Section-wise performance

## 🗄️ Database Collections

### 1. Admin Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "ADMIN",
  createdAt: Date
}
```

### 2. User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "USER",
  createdAt: Date
}
```

### 3. Section Collection
```javascript
{
  sectionName: String, // LIC, ICICI, SBI, HDFC
  createdBy: ObjectId (Admin),
  createdAt: Date
}
```

### 4. Question Collection
```javascript
{
  sectionId: ObjectId,
  questionText: String,
  questionType: "MCQ" | "FILL_IN_BLANK",
  options: { A, B, C, D },
  correctAnswer: String,
  createdBy: ObjectId (Admin),
  createdAt: Date
}
```

### 5. Answer Collection
```javascript
{
  userId: ObjectId,
  sectionId: ObjectId,
  questionId: ObjectId,
  answerText: String,
  isCorrect: Boolean,
  createdAt: Date
}
```

## 🌐 API Endpoints

### Authentication
- POST `/api/auth/register` - Register user/admin
- POST `/api/auth/login` - Login
- GET `/api/auth/profile` - Get profile (Protected)

### Admin (Protected - Admin Only)
- POST `/api/admin/sections` - Create section
- GET `/api/admin/sections` - Get all sections
- DELETE `/api/admin/sections/:id` - Delete section
- POST `/api/admin/questions` - Create question
- GET `/api/admin/questions/:sectionId` - Get questions
- PUT `/api/admin/questions/:id` - Update question
- DELETE `/api/admin/questions/:id` - Delete question
- GET `/api/admin/dashboard` - Dashboard stats

### User (Protected)
- GET `/api/sections` - Get all sections
- GET `/api/questions/:sectionId` - Get questions by section
- POST `/api/answers` - Submit answer
- GET `/api/answers/user` - Get user answers
- GET `/api/answers/section/:sectionId` - Get answers by section

## 🎨 UI Design

### Professional Enterprise Theme
- Dark blue cybersecurity theme
- Banking/Insurance portal inspired
- Card-based layouts
- Professional typography
- Subtle animations
- Fully responsive

### Design Inspiration
- LIC Official Portal
- ICICI Bank Interface
- Zoho Admin Dashboard
- Enterprise SaaS Applications

## 🔒 Security Features

✅ Password hashing with bcrypt
✅ JWT token authentication (7-day expiry)
✅ Protected API routes
✅ Role-based authorization
✅ CORS configuration
✅ Input validation
✅ MongoDB indexing for performance

## 📦 Production Deployment

### Environment Variables

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/xcyber
JWT_SECRET=your_secure_jwt_secret_key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-api-url.com/api
```

### Deployment Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use MongoDB Atlas for production
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set NODE_ENV=production
- [ ] Add rate limiting
- [ ] Set up logging
- [ ] Configure backups

## 🧪 Testing

### Create Test Accounts

**Admin:**
```json
{
  "name": "Admin User",
  "email": "admin@xcyber.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

**User:**
```json
{
  "name": "Test Student",
  "email": "student@xcyber.com",
  "password": "student123",
  "role": "USER"
}
```

### Test Flow

1. Register admin account
2. Login as admin
3. Create sections (LIC, ICICI, SBI, HDFC)
4. Add questions to each section
5. Logout and register user account
6. Login as user
7. Select a section
8. Answer questions
9. Submit and verify

## 📱 Responsive Design

✅ Desktop (1920px+)
✅ Laptop (1366px)
✅ Tablet (768px)
✅ Mobile (375px)

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- Bcrypt.js
- CORS

### Frontend
- React 18
- TypeScript
- React Router DOM
- Tailwind CSS v4
- Lucide Icons
- Vite

## 📄 License

Proprietary - XCyber Platform

## 👥 Support

For production deployment support:
- Email: support@xcyber.com
- Documentation: /docs
- API Reference: /api-docs

---

**Built with enterprise-grade security and scalability**
