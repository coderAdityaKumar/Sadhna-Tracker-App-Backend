# Sadhna Tracker - Backend API

A comprehensive backend API for tracking spiritual practices and daily goals. Built with **Node.js**, **Express**, and **MongoDB**, this project provides a robust platform for users to monitor their daily sadhna (spiritual practice) progress.

## 📋 Overview

Sadhna Tracker Backend is a RESTful API that manages user authentication, spiritual practice tracking, and daily goal management. The application is designed with security, scalability, and clean code principles in mind.

### Key Features

✨ **User Management**
- Secure user registration with email verification
- JWT-based authentication and authorization
- Role-based access control (User/Admin)
- Password reset functionality with secure token validation
- User profile management

✨ **Sadhna Tracking**
- Track daily spiritual practices including:
  - Mangala Arti attendance with late minutes tracking
  - Study hours logging
  - Chanting rounds counter
  - Book reading progress
- Date-based sadhna records with historical data
- Daily goals setup and progress checking

✨ **Security & Performance**
- Password encryption with bcrypt
- JWT token-based authentication
- CORS enabled for frontend integration
- Rate limiting to prevent abuse
- Input validation and sanitization
- Helmet for HTTP header security
- Email notifications for password recovery

✨ **Architecture**
- Modular and scalable project structure
- Clean separation of concerns (Controllers, Models, Routes, Middlewares)
- Comprehensive error handling
- Custom API response wrappers
- Async/await pattern with error wrapping

## 🏗️ Project Structure

```
src/
├── config/              # Database configuration
├── controllers/         # Business logic handlers
│   ├── auth.controllers.js
│   ├── sadhna.controllers.js
│   ├── user.controllers.js
│   └── ekadashi.data.controller.js
├── middlewares/        # Custom middleware
│   ├── auth.middleware.js
│   └── auth.roles.js
├── models/            # MongoDB schemas
│   ├── users.models.js
│   ├── sadhna.models.js
│   ├── dailyGoals.models.js
│   └── ekadashi.model.js
├── routes/            # API endpoints
│   ├── auth.routes.js
│   ├── sadhna.routes.js
│   ├── user.routes.js
│   └── live.routes.js
├── utils/             # Helper functions
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   └── email.js
├── validators/        # Input validation schemas
│   ├── register-user.validator.js
│   ├── create-sadhna.validator.js
│   └── query-token.validator.js
├── app.js            # Express app configuration
└── server.js         # Server entry point
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Email Service**: Nodemailer
- **Security**: Helmet, CORS, Express Rate Limit
- **Validation**: Express Validator
- **Development**: Nodemon

## 📦 Dependencies

```json
{
  "bcrypt": "^5.1.1",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^5.1.0",
  "express-rate-limit": "^7.5.0",
  "express-validator": "^7.2.1",
  "helmet": "^8.1.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.13.2",
  "nodemailer": "^6.10.0",
  "nodemon": "^3.1.10"
}
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Sadhna-Tracker-App-Backend.git
   cd Sadhna-Tracker-App-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/sadhna-tracker
   # or for MongoDB Atlas:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sadhna-tracker

   # Authentication
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRY=7d

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000

   # Email Configuration (for password reset notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### Running the Application

**Development Mode** (with auto-reload):
```bash
npm start
```

**Watch Mode**:
```bash
npm run dev
```

The server will start at `http://localhost:3000`

## 📚 API Endpoints

### Authentication Routes (`/auth`)
- `POST /auth/register-user` - Register a new user
- `GET /auth/verify-user?token=<token>` - Verify email with token
- `POST /auth/login-user` - Login user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password/:token` - Reset password with token
- `POST /auth/logout-user` - Logout user (protected)

### Sadhna Routes (`/sadhna`)
- `POST /sadhna/create-sadhna` - Create daily sadhna record (protected)
- `GET /sadhna/get-sadhna` - Fetch user's sadhna records (protected)
- `GET /sadhna/check-daily-goals` - Check if daily goals are filled (protected)
- `PUT /sadhna/set-daily-goals` - Set/update daily goals (protected)

### User Routes (`/user`)
- Manage user profile and preferences (protected)

### Live Routes (`/live`)
- Real-time data endpoints

## 🔐 Security Features

- **Password Security**: Bcrypt hashing with salt rounds
- **Token-Based Auth**: Secure JWT tokens with expiration
- **CORS Protection**: Configured for specific frontend origins
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Express-validator for all user inputs
- **Helmet Security**: HTTP header protection
- **Email Verification**: Secure token-based email verification
- **Password Reset**: Secure token-based password recovery

## 📝 Data Models

### User Schema
- Username, Email (unique)
- First Name, Last Name
- Hashed Password
- Role (User/Admin)
- Email Verification Status
- Verification Token
- Hostel Information
- Timestamps

### Sadhna Schema
- Date-wise records
- Mangala Arti attendance tracking
- Study hours
- Chanting rounds
- Book reading progress
- Notes and remarks

### Daily Goals Schema
- Target study hours
- Target chanting rounds
- Target book pages
- Reset frequency

## 🧪 Testing

To test API endpoints, use tools like:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://www.thunderclient.com/)

Example request with authentication:
```bash
curl -X GET http://localhost:3000/sadhna/get-sadhna \
  -H "Authorization: Bearer <your_jwt_token>"
```

## 🎯 Key Accomplishments

- ✅ Fully functional REST API with CRUD operations
- ✅ Secure authentication with JWT and password hashing
- ✅ Email verification and password reset flows
- ✅ Comprehensive input validation and error handling
- ✅ Role-based access control
- ✅ MongoDB integration with Mongoose ODM
- ✅ Production-ready security measures
- ✅ Modular and maintainable code architecture

## 🔄 Development Workflow

1. Create a feature branch
2. Make your changes
3. Test thoroughly with Postman or similar tools
4. Commit with clear messages
5. Push and create a pull request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Your Name**
- Portfolio: [your-portfolio-url]
- LinkedIn: [your-linkedin-url]
- GitHub: [@your-github-handle]

## 📞 Support

For questions or feedback about this project, please feel free to reach out or open an issue in the repository.

---

**Note**: This is the backend API. For the complete application, you may also need the corresponding frontend repository.
