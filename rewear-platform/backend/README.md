# ReWear Backend API

A comprehensive Node.js/Express backend for the ReWear sustainable fashion platform, featuring MongoDB integration, JWT authentication, and secure user data management.

## Features

- 🔐 **Secure Authentication**: JWT-based authentication with password hashing
- 📦 **Item Management**: CRUD operations for clothing items with image upload
- 🔄 **Swap System**: Complete swap transaction management with messaging
- 👥 **User Management**: User profiles, statistics, and preferences
- 🏆 **Points System**: Gamified points and level system
- 📊 **Analytics**: User statistics and leaderboards
- 🔍 **Search & Filtering**: Advanced search and filtering capabilities
- 📧 **Email Integration**: Password reset and notification emails
- 🛡️ **Security**: Rate limiting, input validation, and error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)
- Email service (Gmail, SendGrid, etc.)

## Installation

1. **Clone the repository**
   ```bash
   cd rewear-platform/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/rewear-platform
   MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/rewear-platform

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=30d

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # Security
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| POST | `/api/auth/forgot-password` | Request password reset | Public |
| POST | `/api/auth/reset-password/:token` | Reset password | Public |
| PUT | `/api/auth/profile` | Update profile | Private |
| PUT | `/api/auth/change-password` | Change password | Private |

### Items

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/items` | Get all items with filtering | Public |
| GET | `/api/items/:id` | Get single item | Public |
| POST | `/api/items` | Create new item | Private |
| PUT | `/api/items/:id` | Update item | Private |
| DELETE | `/api/items/:id` | Delete item | Private |
| POST | `/api/items/:id/like` | Toggle like on item | Private |
| POST | `/api/items/:id/swap-request` | Add swap request | Private |
| GET | `/api/items/trending` | Get trending items | Public |
| GET | `/api/items/category/:category` | Get items by category | Public |

### Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users/:id` | Get user profile | Public |
| GET | `/api/users/:id/items` | Get user's items | Public |
| GET | `/api/users/:id/swaps` | Get user's swaps | Private |
| GET | `/api/users/:id/pending-swaps` | Get pending swaps | Private |
| PUT | `/api/users/:id/avatar` | Update avatar | Private |
| GET | `/api/users/:id/stats` | Get user statistics | Private |
| GET | `/api/users/leaderboard` | Get leaderboard | Public |
| GET | `/api/users/search` | Search users | Public |
| PUT | `/api/users/:id/preferences` | Update preferences | Private |
| PUT | `/api/users/:id/deactivate` | Deactivate account | Private |

### Swaps

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/swaps` | Create new swap | Private |
| GET | `/api/swaps` | Get user's swaps | Private |
| GET | `/api/swaps/:id` | Get single swap | Private |
| PUT | `/api/swaps/:id/status` | Update swap status | Private |
| POST | `/api/swaps/:id/messages` | Add message to swap | Private |
| POST | `/api/swaps/:id/rate` | Rate swap partner | Private |
| GET | `/api/swaps/stats` | Get swap statistics | Private |
| PUT | `/api/swaps/:id/cancel` | Cancel swap | Private |

## Data Models

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  avatar: String,
  location: String,
  bio: String,
  points: Number,
  level: String,
  totalSwaps: Number,
  itemsListed: Number,
  rating: Number,
  isActive: Boolean,
  preferences: {
    notifications: { email: Boolean, push: Boolean },
    privacy: { showLocation: Boolean, showStats: Boolean }
  }
}
```

### Item Model
```javascript
{
  title: String,
  description: String,
  category: String,
  size: String,
  condition: String,
  points: Number,
  tags: [String],
  images: [String],
  uploader: ObjectId,
  status: String,
  views: Number,
  likes: Number,
  swapRequests: [{
    requester: ObjectId,
    message: String,
    status: String
  }]
}
```

### Swap Model
```javascript
{
  requester: ObjectId,
  provider: ObjectId,
  requestedItem: ObjectId,
  offeredItem: ObjectId,
  swapType: String,
  pointsInvolved: Number,
  status: String,
  messages: [{
    sender: ObjectId,
    message: String,
    createdAt: Date
  }],
  requesterRating: { rating: Number, comment: String },
  providerRating: { rating: Number, comment: String }
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if any
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Configurable via environment variables

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Rate limiting
- Error handling without exposing sensitive information

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use production MongoDB URI
3. Configure proper CORS origins
4. Set up environment variables
5. Use PM2 or similar process manager

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 