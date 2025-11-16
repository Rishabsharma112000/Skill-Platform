# Portal Backend

## Description

This is the backend for the Skill Portal application, built with Node.js and Express. It provides RESTful APIs for user authentication, skill management, question management, quiz attempts, and performance reporting.

## Features

- User Authentication (Registration, Login)
- Role-Based Access Control (RBAC) for Admin and User roles
- CRUD operations for Skills
- CRUD operations for Questions with multiple-choice options
- Quiz taking functionality
- Quiz attempt submission and scoring
- Performance reporting for users (overall and skill-based)
- Skill gap analysis
- Time-based performance reports

## Requirements

- Node.js 
- npm (Node Package Manager)
- MySQL database
- Redis (for caching)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd Skill_Portal_App/Portal_Backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Database Setup:**

    *   Create a MySQL database.
    *   Update the database configuration in `db/db.js`.
    *   Run the initial SQL script to create tables:

        ```bash
        mysql -u <username> -p <database_name> < db/init.sql
        ```
        Replace `<username>` and `<database_name>` with your MySQL credentials and database name.

4.  **Environment Variables:**

    Create a `.env` file in the `Portal_Backend` directory with the following variables:

    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_DATABASE=skill_portal
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=7d
    REDIS_HOST=localhost
    REDIS_PORT=6379
    ```
    Make sure to replace `your_password` and `your_jwt_secret` with strong, secure values.

## Running the Application

To run the backend application with Docker Compose (recommended):

```bash
cd ../..
docker-compose up --build
```

This will build the backend Docker image, and start the MySQL, Redis, and backend services. The backend server will be accessible at `http://localhost:4000`.

To stop the Docker Compose services:

```bash
cd ../..
docker-compose down
```

To run the backend application directly (without Docker):

```bash
npm start
```

The backend server will start on `http://localhost:4000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication

-   `POST /api/auth/register` - Register a new user
-   `POST /api/auth/login` - Log in a user

### Users (Admin & Self)

-   `GET /api/users` - Admin: List all users
-   `GET /api/users/me` - Authenticated user: Get own profile
-   `PUT /api/users/me` - Authenticated user: Update own profile
-   `PUT /api/users/me/password` - Authenticated user: Change own password
-   `GET /api/users/:id` - Admin: Get user by ID
-   `PUT /api/users/:id` - Admin: Update user by ID
-   `DELETE /api/users/:id` - Admin: Delete user by ID

### Skills

-   `POST /api/skills` - Admin: Create a new skill
-   `GET /api/skills` - Get all skills
-   `GET /api/skills-with-questions` - Get skills that have associated questions (used for user quizzes)
-   `GET /api/skills/:id` - Get skill by ID
-   `PUT /api/skills/:id` - Admin: Update skill by ID
-   `DELETE /api/skills/:id` - Admin: Delete skill by ID

### Questions

-   `POST /api/questions` - Admin: Create a new question
-   `GET /api/questions` - Get all questions
-   `GET /api/questions/:id` - Get question by ID
-   `PUT /api/questions/:id` - Admin: Update question by ID
-   `DELETE /api/questions/:id` - Admin: Delete question by ID

### Quizzes

-   `GET /api/skills/:id/quiz` - Get quiz questions for a specific skill
-   `POST /api/quizzes/attempt` - Submit a quiz attempt

### Reports

-   `GET /api/reports/users/:userId/performance` - Admin: Get performance report for a specific user
-   `GET /api/reports/me/performance` - User: Get own performance report
-   `GET /api/reports/skill-gap` - Admin: Get skill gap report
-   `GET /api/reports/time-based` - Admin: Get time-based report

## Technical Stack

-   Node.js
-   Express.js
-   MySQL
-   Redis
-   jsonwebtoken
-   bcryptjs


