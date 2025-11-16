# Portal Frontend Application

## Description

This is the frontend application for the Skill Portal, built with React. It provides a user-friendly interface for authentication, skill-based quizzes, performance tracking, and admin functionalities.

## Features

- User Registration and Login
- User Dashboard to view available skills and take quizzes
- Quiz Taker interface with multiple-choice questions
- Display of past performance reports
- Skill Gap Report with list and bar chart visualization
- Admin Panel for managing questions and viewing user reports
- Role-based navigation

## Requirements

- Node.js
- npm (Node Package Manager)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd Skill_Portal_App/portal_frontend_app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**

    Create a `.env` file in the `portal_frontend_app` directory with the following variable (if your backend is running on a different port/host):

    ```
    REACT_APP_API_BASE_URL=http://localhost:4000/api
    ```

## Running the Application

```bash
npm start
```

The frontend application will open in your browser at `http://localhost:3000` (or another available port).

## Project Structure

-   `public/`: Static assets and `index.html`.
-   `src/`:
    -   `App.js`: Main application component and routing setup.
    -   `index.js`: Entry point of the React application.
    -   `components/`: Reusable UI components like `LoginRegister`, `UserDashboard`, `AdminPanel`, `QuizTaker`, `PastPerformance`, `SkillGapReport`, etc.
    -   `config/`: API route definitions (`api.js`).
    -   `context/`: React Context for global state management (`AuthContext.js`).
    -   `App.css`, `index.css`: Global styles.

## Technical Stack

-   React.js
-   React Router DOM
-   Axios (for API calls)
-   react-chartjs-2 & Chart.js (for data visualization)
-   Tailwind CSS (for styling, assuming it's configured)


