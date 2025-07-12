# Abdopr Project Documentation

## Project Overview

Abdopr is a Node.js/Express.js backend application with authentication, user management, book management, cart functionality, and order processing.

## Project Structure

```
Abdopr/
├── database/
│   ├── dbconnection.js
│   └── models/
│       ├── admin.model.js
│       ├── books.model.js
│       ├── cart.model.js
│       ├── order.model.js
│       └── user.model.js
├── src/
│   ├── middleware/
│   │   ├── catchError.js
│   │   ├── cheackPhone.js
│   │   ├── fileUpload.js
│   │   ├── globalError.js
│   │   ├── protectedroutes.js
│   │   ├── validation.js
│   │   └── verifyToken.js
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   ├── auth_Admin/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   ├── book/
│   │   │   ├── book.controller.js
│   │   │   └── book.routes.js
│   │   ├── cart/
│   │   │   ├── cart.controoler.js
│   │   │   └── cart.routes.js
│   │   ├── order/
│   │   │   ├── order.controller.js
│   │   │   └── order.routes.js
│   │   └── users/
│   │       ├── users.controllrt.js
│   │       └── users.routes.js
│   └── utils/
│       └── appError.js
├── index.js
└── package.json
```

## Key Features Implemented

### 1. Authentication System

- **User Registration** (`POST /auth/signup`)
- **User Login** (`POST /auth/signin`)
- **Admin Authentication** (separate module)
- **Password Reset** (`GET /auth/setdefaultpassword/:id`)
- **Phone Number Validation** (custom middleware)

### 2. Database Models

- **User Model**: User registration and management
- **Admin Model**: Admin user management
- **Books Model**: Book catalog management
- **Cart Model**: Shopping cart functionality
- **Order Model**: Order processing and management

### 3. Middleware Functions

- **Validation Middleware**: Request validation using Joi
- **Error Handling**: Global error handling and custom error classes
- **Authentication**: Token verification and protected routes
- **File Upload**: File upload handling
- **Phone Validation**: Custom phone number validation

### 4. API Endpoints

- **Auth Routes**: User authentication and registration
- **Book Routes**: Book management (CRUD operations)
- **Cart Routes**: Shopping cart operations
- **Order Routes**: Order processing
- **User Routes**: User management

## Implementation Details

### Authentication Flow

1. User signs up with validation
2. Phone number is checked for uniqueness
3. User can sign in with credentials
4. JWT tokens are used for session management
5. Protected routes require valid tokens

### Error Handling

- Custom `AppError` class for structured error responses
- Global error handling middleware
- Validation errors with detailed messages
- Proper HTTP status codes

### Database Connection

- MongoDB connection with Mongoose
- Separate models for different entities
- Proper schema validation

## Key Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Joi** - Request validation
- **Multer** - File upload handling

## Setup Instructions

1. Install dependencies: `npm install`
2. Set up MongoDB connection
3. Configure environment variables
4. Run the application: `npm start`

## Notes from Development

- Phone number validation was implemented as custom middleware
- Separate admin authentication system
- Modular structure for easy maintenance
- Comprehensive error handling throughout the application
