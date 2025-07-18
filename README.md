# Task Management Application (Frontend Only)

A responsive task management application built with React and TypeScript, simulating user authentication and task CRUD operations using a mocked API.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [How to Run Locally](#how-to-run-locally)
- [Mocking Layer (MSW) Explained](#mocking-layer-msw-explained)
- [Live Demo](#live-demo)
- [Optional Enhancements (Bonus)](#optional-enhancements-bonus)

## Features

* **User Authentication:**
    * Login page with mocked authentication (username: `test`, password: `test123`).
    * Session persistence using `localStorage` for the authentication token.
    * Protected dashboard route, accessible only when authenticated.
    * Logout functionality.
* **Task Management (CRUD):**
    * Dashboard displaying a list of tasks.
    * Forms to create new tasks (title, description, status).
    * Ability to edit existing tasks.
    * Ability to delete tasks.
    * **Search Filter:** Filter tasks by title and description.
* **State Management:** All application state is managed efficiently using **Redux Toolkit** and **React-Redux**.
* **Responsive UI & Theming:**
    * Clean and mobile-friendly design implemented with **Material UI (MUI)**.
    * **Dark/Light Mode Toggle:** Users can switch between dark and light themes, with preference persisted in `localStorage`.
* **Empty State & Error Views:** User-friendly messages are displayed for empty task lists, no search results, and API errors.

## Technologies Used

* **Framework:** React (Vite)
* **Language:** TypeScript
* **State Management:** Redux Toolkit, React-Redux
* **Styling:** Material UI (MUI), Emotion (for MUI's styling engine)
* **Mock API:** Mock Service Worker (MSW) for simulating backend interactions.
* **HTTP Client:** Native `fetch` API.
* **Routing:** React Router DOM.
* **Persistence:** `localStorage` for authentication token and theme preference.

## Project Structure

task-manager-app/
├── public/                 # Public assets (e.g., index.html)
├── src/
│   ├── api/                # MSW setup (handlers, worker config)
│   │   ├── handlers.ts     # Defines mocked API endpoints
│   │   └── browser.ts      # MSW worker setup for browser
│   ├── app/                # Redux store configuration
│   │   └── store.ts        # Root Redux store, RootState, AppDispatch types
│   ├── assets/             # Static assets (images, etc. - if any)
│   ├── components/         # Reusable UI components
│   │   ├── MuiThemeWrapper.tsx # Component providing Material UI theme
│   │   └── ProtectedRoute.tsx # Route protection component
│   ├── features/           # Feature-specific logic (slices, components)
│   │   ├── auth/
│   │   │   └── authSlice.ts    # Auth Redux slice
│   │   ├── tasks/
│   │   │   └── tasksSlice.ts   # Tasks Redux slice
│   │   └── ui/             # UI specific state (e.g., theme mode)
│   │       └── uiSlice.ts      # UI Redux slice
│   ├── pages/              # Top-level page components
│   │   ├── LoginPage.tsx   # Login screen
│   │   └── DashboardPage.tsx # Main task dashboard
│   ├── utils/              # Utility functions (if any)
│   ├── App.tsx             # Main application component with routing
│   ├── main.tsx            # Entry point of the React application
│   └── index.css           # Global CSS (if any, typically minimal with MUI)
├── package.json            # Project dependencies and scripts
├── README.md               # This documentation file
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── .eslintrc.cjs           # ESLint configuration


## How to Run Locally

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**

    git clone <YOUR_REPOSITORY_URL_HERE>
    cd task-manager-app

2.  **Install dependencies:**

    npm install

3.  **Start the development server:**

    npm run dev

    The application will typically be available at `http://localhost:5173`.

## Mocking Layer (MSW) Explained

This application uses **Mock Service Worker (MSW)** to simulate backend API responses directly within the browser. This allows for full frontend development and testing without requiring a real backend server.

* **How it Works:**
    * **`src/api/handlers.ts`**: Defines the mock API endpoints and their responses for `POST /login`, `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, and `DELETE /tasks/:id`.
    * **In-Memory Data:** Task data (`let tasks = [...]`) is stored in memory within the MSW worker. This means task changes (add, edit, delete) are persisted only for the current browser session; they will **reset if you refresh the browser or restart the development server**. This is a design choice for a frontend-only mock.
    * **Worker Activation:** In `src/main.tsx`, the MSW worker is started (`worker.start()`) only in `development` mode (`process.env.NODE_ENV === 'development'`). This ensures that during development, all `fetch` requests are intercepted by MSW.
* **Authentication:** The `/login` endpoint is mocked to accept `username: test` and `password: test123`. A fake JWT token is returned and stored in `localStorage` for session persistence.

