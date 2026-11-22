# Alzikrayat - MERN Edition

UI redesign edition with an editorial, warm-cream and forest-green visual system.

Alzikrayat is a full-stack photo-sharing application built with React, Vite, Express, MongoDB, and Mongoose.

## Structure

- `client/`: React frontend and Vite configuration
- `server/`: Express REST API, Mongoose models, controllers, routes, middleware, and uploads

## Requirements

- Node.js 18 or newer
- npm
- MongoDB local instance or MongoDB Atlas

## Setup

1. Install dependencies:

   ```bash
   npm install
   npm run install:all
   ```

2. Configure the server:

   ```bash
   cp server/.env.example server/.env
   ```

   Set `MONGODB_URI` to a valid MongoDB connection string. Set `PORT` if 5000 is unavailable.

3. Start both applications:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173`.

The Vite development server proxies `/api` and `/uploads` to the Express server at port 5000.

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/photos`
- `GET /api/photos/:id`
- `POST /api/photos`
- `DELETE /api/photos/:id`
- `POST /api/photos/:id/comments`

Write operations require the logged-in user ID in the `x-user-id` header. This basic client-session implementation does not use JWT; login state is stored in localStorage.
