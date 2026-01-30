# XCyber Backend API

Complete backend API for XCyber Question-Answer Platform with JWT authentication and role-based access control.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── jwt.js             # JWT utilities
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Question.js        # Question schema
│   │   └── Answer.js          # Answer schema
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── admin.controller.js
│   │   ├── question.controller.js
│   │   └── answer.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verification
│   │   └── role.middleware.js  # Role-based access
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   ├── question.routes.js
│   │   └── answer.routes.js
│   ├── app.js                 # Express app
│   └── server.js              # Server entry point
├── .env
├── .env.example
├── package.json
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Steps

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   ```env
   MONGODB_URI=mongodb://localhost:27017/xcyber
   JWT_SECRET=your_secure_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Start the server**
   
   **Development mode** (with auto-restart):
   ```bash
   npm run dev
   ```
   
   **Production mode**:
   ```bash
   npm start
   ```

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get user profile | Private |

### Admin (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/admin/questions` | Create question | Admin |
| PUT | `/api/admin/questions/:id` | Update question | Admin |
| DELETE | `/api/admin/questions/:id` | Delete question | Admin |
| GET | `/api/admin/dashboard` | Get dashboard stats | Admin |

### Questions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/questions` | Get all questions | Private |
| GET | `/api/questions/:id` | Get question by ID | Private |

### Answers

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/answers` | Submit answer | Private |
| GET | `/api/answers` | Get my answers | Private |
| GET | `/api/answers/:userId` | Get user answers | Private/Admin |

## 📝 API Usage Examples

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Question (Admin)

```bash
curl -X POST http://localhost:5000/api/admin/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "questionText": "What is 2+2?",
    "questionType": "MCQ",
    "options": {
      "A": "3",
      "B": "4",
      "C": "5",
      "D": "6"
    },
    "correctAnswer": "B"
  }'
```

### Submit Answer

```bash
curl -X POST http://localhost:5000/api/answers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "questionId": "QUESTION_ID",
    "answerText": "B"
  }'
```

## 🔐 Authentication Flow

1. User registers or logs in
2. Server returns JWT token
3. Client stores token (localStorage/sessionStorage)
4. Client sends token in Authorization header: `Bearer <token>`
5. Server validates token on protected routes

## 🗄️ Database Schema

### User
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed),
  role: String (ADMIN/USER),
  createdAt: Date,
  updatedAt: Date
}
```

### Question
```javascript
{
  questionText: String,
  questionType: String (MCQ/FILL_IN_BLANK),
  options: {
    A: String,
    B: String,
    C: String,
    D: String
  },
  correctAnswer: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Answer
```javascript
{
  userId: ObjectId (ref: User),
  questionId: ObjectId (ref: Question),
  answerText: String,
  isCorrect: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Protected routes with middleware
- Input validation
- CORS configuration
- Environment variable protection

## 🧪 Testing

Health check endpoint:
```bash
curl http://localhost:5000/health
```

## 🚀 Deployment

### Production Checklist

1. Update `.env` with production values
2. Set strong `JWT_SECRET`
3. Use MongoDB Atlas or production database
4. Set `NODE_ENV=production`
5. Enable HTTPS
6. Configure proper CORS origins
7. Set up logging and monitoring

## 📄 License

ISC

## 👥 Contributors

XCyber Development Team
