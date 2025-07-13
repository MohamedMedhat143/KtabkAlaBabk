# Vercel Deployment Guide

## Prerequisites

1. Install Vercel CLI: `npm i -g vercel`
2. Have a Vercel account (sign up at vercel.com)
3. MongoDB Atlas account for database

## Step 1: Prepare Your Environment Variables

Create a `.env` file in your root directory with the following variables:

```env
# Database Configuration
DATABASE_USERNAME=your_mongodb_username
DATABASE_PASSWORD=your_mongodb_password
DATABASE_NAME=your_database_name

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRES_IN=90d

# Server Configuration
PORT=4000
NODE_ENV=production

# ImageKit Configuration (if using)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# CORS Configuration
CORS_ORIGIN=*
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

1. Open terminal in your project root
2. Run: `vercel login`
3. Run: `vercel`
4. Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? `Select your account`
   - Link to existing project? `N`
   - Project name? `your-project-name`
   - Directory? `./` (current directory)
   - Override settings? `N`

### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables in the dashboard
5. Deploy

## Step 3: Configure Environment Variables in Vercel

After deployment, go to your Vercel dashboard:

1. Select your project
2. Go to "Settings" → "Environment Variables"
3. Add all the environment variables from your `.env` file

## Step 4: Update Database Connection

Make sure your MongoDB Atlas:

1. Has network access configured to allow connections from anywhere (0.0.0.0/0)
2. Has a user with read/write permissions
3. Connection string is correct

## Step 5: Test Your Deployment

Your app will be available at: `https://your-project-name.vercel.app`

## Important Notes

1. **File Uploads**: If you're using file uploads, consider using cloud storage (AWS S3, Cloudinary, etc.) as Vercel has limitations with file storage.

2. **Database**: Make sure your MongoDB Atlas cluster is accessible from Vercel's servers.

3. **CORS**: Update your CORS configuration to allow your Vercel domain.

4. **Build Folder**: Your React build folder is already included and will be served by the Express server.

## Troubleshooting

- If you get build errors, check the Vercel logs in the dashboard
- If database connection fails, verify your MongoDB Atlas settings
- If environment variables aren't working, make sure they're set in Vercel dashboard

## Commands for Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```
