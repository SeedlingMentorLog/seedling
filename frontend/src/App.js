import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import LoginPage from "./pages/GeneralPages/LoginPage";
import SignupPage from "./pages/GeneralPages/SignupPage";
import ForgotPasswordPage from "./pages/GeneralPages/ForgotPasswordPage";

import TimeLoggedPage from "./pages/MentorPages/TimeLoggedPage";
import YourMatchPage from "./pages/MentorPages/YourMatchPage";
import LogTimePage from "./pages/MentorPages/LogTimePage";
import MentorHomePage from "./pages/MentorPages/MentorHomePage";
// import CalendarPage from './pages/CalendarPage';

import DashboardPage from "./pages/AdminPages/DashboardPage";
import MemberInfoPage from "./pages/AdminPages/MemberInfoPage";
import MentorLogsPage from "./pages/AdminPages/MentorLogsPage";

import PrivateRouteComponent from "./components/RoutingComponents/PrivateRouteComponent";
import AdminRouteComponent from "./components/RoutingComponents/AdminRouteComponent";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Private Routes */}
          <Route
            path="/log-time"
            element={<PrivateRouteComponent element={<LogTimePage />} />}
          />
          <Route
            path="/time-logged"
            element={<PrivateRouteComponent element={<TimeLoggedPage />} />}
          />
          <Route
            path="/your-match"
            element={<PrivateRouteComponent element={<YourMatchPage />} />}
          />
          <Route
            path="/mentor-homepage"
            element={<PrivateRouteComponent element={<MentorHomePage />} />}
          />

          {/* Admin */}
          {/* <Route path="/calendar" element={<CalendarPage />} /> */}
          <Route
            path="/dashboard"
            element={<AdminRouteComponent element={<DashboardPage />} />}
          />
          <Route
            path="/member-info"
            element={<AdminRouteComponent element={<MemberInfoPage />} />}
          />
          <Route
            path="/mentor-logs"
            element={<AdminRouteComponent element={<MentorLogsPage />} />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
