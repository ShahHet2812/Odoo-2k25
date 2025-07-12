# ReWear Platform Setup Guide

This guide will help you set up the complete ReWear sustainable fashion platform with both frontend and backend components.

## 🏗️ Project Structure

```
rewear-platform/
├── app/                    # Next.js frontend pages
├── components/             # React components
├── lib/                   # Utilities and API client
├── backend/               # Node.js/Express backend
│   ├── config/           # Database configuration
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── server.js         # Main server file
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud)
- **npm** or **pnpm**

### 1. Clone and Setup

```bash
# Navigate to the project directory
cd rewear-platform

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Configuration

#### Frontend Environment (.env.local)
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Backend Environment
Copy the example environment file and configure it:

```bash
cd backend
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

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12
```

### 3. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The database will be created automatically when the backend starts

#### Option B: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI_PROD` in your `.env` file

### 4. External Services Setup

#### Cloudinary (Image Upload)
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Update the Cloudinary configuration in your `.env` file

#### Email Service (Password Reset)
1. Set up an email service (Gmail, SendGrid, etc.)
2. Configure SMTP settings in your `.env` file

### 5. Start the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
# From the root directory
npm run dev
```

The frontend will start on `http://localhost:3000`

### 6. Verify Installation

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"OK","message":"ReWear API is running"}`

2. **Frontend**
   - Open `http://localhost:3000`
   - You should see the ReWear homepage

## 🔧 Development

### Backend Development

#### Available Scripts
```bash
cd backend
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
```

#### API Testing
You can test the API endpoints using tools like:
- **Postman**
- **Insomnia**
- **curl**

Example API calls:
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'

# Get items
curl http://localhost:5000/api/items
```

### Frontend Development

#### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

#### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:5000/api)

## 🗄️ Database Models

### User Model
- Authentication and profile information
- Points and level system
- Swap statistics
- Privacy preferences

### Item Model
- Clothing item details
- Images and metadata
- Swap requests
- Engagement metrics

### Swap Model
- Transaction details
- Messaging system
- Rating and feedback
- Status tracking

## 🔐 Security Features

### Backend Security
- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers

### Frontend Security
- Token-based authentication
- Secure API calls
- Input validation
- Protected routes

## 📊 Features

### Authentication
- User registration and login
- Password reset via email
- JWT token management
- Profile management

### Item Management
- Create, read, update, delete items
- Image upload to Cloudinary
- Search and filtering
- Categories and tags

### Swap System
- Request and accept swaps
- Messaging between users
- Rating and feedback
- Status tracking

### User Features
- Points and level system
- User profiles and statistics
- Leaderboards
- Privacy settings

## 🚀 Production Deployment

### Backend Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   MONGODB_URI_PROD=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   ```

2. **Process Manager**
   ```bash
   npm install -g pm2
   pm2 start server.js --name rewear-backend
   ```

3. **Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Frontend Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel/Netlify**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

## 🔧 Troubleshooting

### Common Issues

#### Backend Issues
1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper Authorization header

3. **Image Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper file format

#### Frontend Issues
1. **API Connection Error**
   - Check if backend is running
   - Verify API URL in environment
   - Check CORS configuration

2. **Authentication Issues**
   - Clear localStorage
   - Check token expiration
   - Verify API endpoints

### Debug Mode

#### Backend Debug
```bash
# Enable debug logging
DEBUG=* npm run dev
```

#### Frontend Debug
```bash
# Enable Next.js debug
NODE_ENV=development npm run dev
```

## 📝 API Documentation

Complete API documentation is available in the backend README:
- Authentication endpoints
- Item management
- User operations
- Swap system
- Error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the console for error messages
4. Verify all environment variables are set correctly

## 🎯 Next Steps

After successful setup:
1. Create your first user account
2. Add some test items
3. Test the swap functionality
4. Customize the UI to match your brand
5. Deploy to production

Happy coding! 🚀 