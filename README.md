# ManisR

ManisR is a full-stack web application that connects users who wish to give meals (Givers) with those who want to take meals (Takers). The app features real‑time location mapping, meal tracking, and review flows to create a seamless experience for both parties.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)
- [Contact](#contact)

## Features

- **User Authentication:**  
  Users can register, log in, and verify their email addresses using JWT tokens.
  Currently using email to register so as not to pay for the API for notifications, but later if needed we will replace the registration process with an API that supports notifications.

- **Meal Giving & Taking:**  
  - **Givers** can post meals with details (description, pickup address, ingredients, etc.) and optionally an image.
  - **Takers** see available meals on a Mapbox map based on their location and can reserve or initiate conversations with givers.

- **Real-Time Tracking:**  
  Once a meal is reserved, both users are navigated to a tracker component with a 30‑minute countdown.  
  The meal status is updated in real‑time using socket.io and polling.

- **Review Flow:**  
  After the meal is collected, both users navigate to a review page where they rate their experience.  
  The review data is stored in the database, and once the review is finalized, the meal is archived in the history.

- **User Progress & Rewards:**  
  A dashboard displays the number of meals a user (giver) has provided. Once they reach 10 meals, they become eligible for vouchers.
  I haven't added a list of coupons that the user can receive once they have accumulated 10 fruits. But I can add them as soon as I need to.

- **Profile and Settings:**  
  Users can update their avatar, view account details, see their usage history, and delete their account—all via a responsive interface.

## Technology Stack

- **Backend:**
  - Node.js with Express
  - PostgreSQL for data storage
  - JWT for authentication
  - Socket.io for real-time communication
  - Multer for file uploads
  - express-rate-limit for request throttling

- **Frontend:**
  - React with TypeScript
  - React Router for navigation
  - Mapbox GL JS for maps
  - Axios for HTTP requests
  - Redux (for state management, if needed)
  - CSS / SCSS for styling

## Architecture

The project is organized into two main parts:

- **Backend (under `/backend`):**  
  Contains all controllers, routes, middleware, and database configuration. The PostgreSQL database has tables including:
  - `users`
  - `food_items`
  - `meal_conversation`
  - `meal_history`
  - `meal_reviews`
  - `user_preferences`

- **Frontend (under `/src`):**  
  A React application with multiple screens (Profile, Menu, TalkToUs, Tracker, Review, etc.) that interact with the backend via REST endpoints and real-time socket events.

## Installation

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/ManisR.git
   cd ManisR/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**  
   Create a `.env` file in the `backend` folder with variables such as:

   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
   JWT_SECRET=yourSecretKey
   DEFAULT_AVATAR=default_logo.png
   NODE_ENV=development
   PORT=3000
   BACKEND_BASE_URL=https://your-backend-url.com
   ```

4. **Run the backend server:**

   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd ../src
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**  
   Create a `.env` file in the frontend folder with variables such as:

   ```
   VITE_API_BASE_URL=https://your-backend-url.com
   VITE_MAPBOX_TOKEN=yourMapboxToken
   ```

4. **Run the frontend application:**

   ```bash
   npm run dev
   ```

## Usage

- **Registration and Login:**  
  Users register, verify their email, and log in to receive a JWT token.

- **Meal Flow:**  
  Givers post meals. Takers can view meals on a map and reserve them. Once a meal is collected, both users navigate to a review screen and rate their experience. Giver progress is tracked and displayed in the user’s profile.

- **Real-Time Features:**  
  The app uses socket.io for events like meal reservations and archiving.

## API Endpoints

Below are some of the key API endpoints:

- **Authentication:**
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /auth/verify-email`

- **User Management:**
  - `GET /users/profile`
  - `PUT /users/avatar`
  - `DELETE /users/delete`

- **Food/Meal Management:**
  - `POST /food/give` – Upload a new meal.
  - `GET /food/available` – Get available meals.
  - `PUT /food/status/:mealId` – Update meal status.
  - `POST /meal-history/archive/:mealId` – Archive a meal.

- **Reviews:**
  - `POST /meal_reviews` – Submit a review.
  - `GET /meal_reviews/giverCount/:userId` – Get count of meals given by the user.

- **Other:**
  - Additional endpoints for messaging, preferences, etc.

## License

This project is licensed under the MIT License.

## Contact

For any questions, please open an issue or contact galomer6708@gmail.com.


