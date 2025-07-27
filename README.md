# DataCollecto Backend

A Node.js + Express + MongoDB backend for the DataCollecto event data capture platform.

## Features

- **Authentication**: JWT-based authentication with user/admin roles
- **Contact Management**: CRUD operations for contact submissions
- **Data Export**: CSV and Excel export functionality
- **Admin Dashboard**: Administrative oversight and user management
- **API Security**: Rate limiting, CORS, and input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Data Export**: json2csv, exceljs
- **Security**: helmet, cors, express-rate-limit
- **Validation**: express-validator

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/datacollecto

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod
```

### 4. Run the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout user

### User Submissions
- `POST /api/submissions` - Create new submission
- `GET /api/submissions` - Get user's submissions
- `GET /api/submissions/:id` - Get specific submission
- `PUT /api/submissions/:id` - Update submission
- `DELETE /api/submissions/:id` - Delete submission
- `GET /api/submissions/export/csv` - Export as CSV
- `GET /api/submissions/export/excel` - Export as Excel

### Admin Routes
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:userId` - Get user details
- `PATCH /api/admin/users/:userId/toggle-status` - Toggle user status
- `GET /api/admin/submissions` - Get all submissions
- `PATCH /api/admin/submissions/:id/status` - Update submission status
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## Frontend Integration

### 1. Update AuthContext

Replace your current `AuthContext.tsx` with the backend-integrated version:

```bash
# Backup your current AuthContext
mv frontend/src/components/auth/AuthContext.tsx frontend/src/components/auth/AuthContext-LocalStorage.tsx

# Use the backend-integrated version
mv frontend/src/components/auth/AuthContext-Backend.tsx frontend/src/components/auth/AuthContext.tsx
```

### 2. Use API Service

The API service is available at `frontend/src/services/api.ts`. Import and use it in your components:

```typescript
import { authAPI, submissionsAPI, userAPI, adminAPI } from '@/services/api';

// Example usage
const handleLogin = async (email: string, password: string, role: string) => {
  try {
    const response = await authAPI.login(email, password, role);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### 3. Update Dashboard Components

Your dashboard components can now use the API service to fetch real data:

```typescript
// In UserDashboard.tsx
import { userAPI } from '@/services/api';

const loadSubmissions = async () => {
  try {
    const response = await userAPI.getSubmissions({ recent: true });
    setSubmissions(response.data.submissions);
    // Update stats
  } catch (error) {
    console.error('Failed to load submissions:', error);
  }
};
```

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Submission Model
```javascript
{
  userId: String,
  rep: String,
  relevancy: String,
  companyName: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  whatsapp: String,
  partnerDetails: [String],
  targetRegions: [String],
  lob: [String],
  tier: String,
  grades: [String],
  volume: String,
  addAssociates: String,
  notes: String,
  businessCardUrl: String,
  submittedAt: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Prevents API abuse
- **CORS**: Configured for frontend integration
- **Input Validation**: express-validator for request validation
- **Security Headers**: helmet.js for security headers

## Development

### Project Structure
```
backend/
├── app.js                 # Main application file
├── controllers/           # Route controllers
│   ├── authController.js
│   ├── submissionController.js
│   └── adminController.js
├── models/               # Database models
│   ├── User.js
│   └── Submission.js
├── routes/               # API routes
│   ├── auth.js
│   ├── submissions.js
│   ├── user.js
│   └── admin.js
├── middlewares/          # Custom middleware
│   ├── auth.js
│   └── errorHandler.js
├── package.json
├── .env.example
└── README.md
```

### Adding New Features

1. **New Model**: Add to `models/` directory
2. **New Routes**: Add to `routes/` directory
3. **New Controller**: Add to `controllers/` directory
4. **Register Routes**: Import and use in `app.js`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **CORS Errors**
   - Verify `FRONTEND_URL` in `.env`
   - Check frontend is running on correct port

3. **JWT Errors**
   - Ensure `JWT_SECRET` is set in `.env`
   - Check token is being sent in Authorization header

4. **Port Already in Use**
   - Change `PORT` in `.env`
   - Kill existing process: `lsof -ti:5000 | xargs kill -9`

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up process manager (PM2)
5. Configure reverse proxy (nginx)
6. Enable HTTPS

## Support

For issues and questions, please check the troubleshooting section or create an issue in the project repository.
