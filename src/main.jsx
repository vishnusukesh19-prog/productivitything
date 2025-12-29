import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import CustomCursor from "./components/CustomCursor";

// Pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Timer from "./pages/Timer";
import Habits from "./pages/Habits";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Gamification from "./pages/Gamification";
import StudyGroups from "./pages/StudyGroups";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-white dark:bg-space-dark">
          <Navbar />
          <CustomCursor />
          <main className="flex-1">
            <Routes>
              {/* Auth */}
              <Route path="/auth" element={<Auth />} />

              {/* Main dashboard overview */}
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Home />
                  </RequireAuth>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Home />
                  </RequireAuth>
                }
              />

              {/* Core productivity tools */}
              <Route
                path="/tasks"
                element={
                  <RequireAuth>
                    <Tasks />
                  </RequireAuth>
                }
              />
              <Route
                path="/notes"
                element={
                  <RequireAuth>
                    <Notes />
                  </RequireAuth>
                }
              />
              <Route
                path="/timer"
                element={
                  <RequireAuth>
                    <Timer />
                  </RequireAuth>
                }
              />
              <Route
                path="/habits"
                element={
                  <RequireAuth>
                    <Habits />
                  </RequireAuth>
                }
              />
              <Route
                path="/calendar"
                element={
                  <RequireAuth>
                    <Calendar />
                  </RequireAuth>
                }
              />
              <Route
                path="/analytics"
                element={
                  <RequireAuth>
                    <Analytics />
                  </RequireAuth>
                }
              />
              <Route
                path="/gamification"
                element={
                  <RequireAuth>
                    <Gamification />
                  </RequireAuth>
                }
              />
              <Route
                path="/study-groups"
                element={
                  <RequireAuth>
                    <StudyGroups />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />

              {/* Simple marketing / info pages */}
              <Route
                path="/features"
                element={
                  <div className="min-h-[60vh] flex items-center justify-center px-4">
                    <div className="max-w-3xl w-full card p-8 space-y-4">
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50">
                        Features
                      </h1>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                        ProdHub combines tasks, notes, calendar, focus timers, habits, analytics and light
                        gamification into one calm student workspace.
                      </p>
                    </div>
                  </div>
                }
              />
              <Route
                path="/screenshots"
                element={
                  <div className="min-h-[60vh] flex items-center justify-center px-4">
                    <div className="max-w-3xl w-full card p-8 space-y-4 text-center">
                      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-50">
                        Screenshots
                      </h1>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                        Explore each section of the app to experience the live, animated UI instead of static
                        screenshots.
                      </p>
                    </div>
                  </div>
                }
              />
              <Route
                path="/user-flow"
                element={
                  <div className="min-h-[60vh] flex items-center justify-center px-4">
                    <div className="max-w-3xl w-full card p-8 space-y-4">
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50">
                        User Flow
                      </h1>
                      <ol className="list-decimal list-inside space-y-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
                        <li>Create an account or sign in.</li>
                        <li>Land on the dashboard overview to see today&apos;s focus and progress.</li>
                        <li>Add tasks, notes, habits, and calendar events as you plan your week.</li>
                        <li>Run Pomodoro sessions with the focus timer to earn points and streaks.</li>
                        <li>Review your analytics and achievements to keep motivation high.</li>
                      </ol>
                    </div>
                  </div>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


