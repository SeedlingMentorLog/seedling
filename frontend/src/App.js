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

import AdminDashboardPage from "./pages/AdminPages/DashboardPage";
import AdminMemberInfoPage from "./pages/AdminPages/MemberInfoPage";
import AdminMentorLogsPage from "./pages/AdminPages/MentorLogsPage";

import SCDashboardPage from "./pages/SchoolContactPages/DashboardPage";
import SCMentorLogsPage from "./pages/SchoolContactPages/MentorLogsPage";

import PrivateRouteComponent from "./components/RoutingComponents/PrivateRouteComponent";
import AdminRouteComponent from "./components/RoutingComponents/AdminRouteComponent";
import SchoolContactRouteComponent from "./components/RoutingComponents/SchoolContactComponent";

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
            path="/admin-dashboard"
            element={<AdminRouteComponent element={<AdminDashboardPage />} />}
          />
          <Route
            path="/admin-member-info"
            element={<AdminRouteComponent element={<AdminMemberInfoPage />} />}
          />
          <Route
            path="/admin-mentor-logs"
            element={<AdminRouteComponent element={<AdminMentorLogsPage />} />}
          />
          <Route
            path="/school-contact-dashboard"
            element={<SchoolContactRouteComponent element={<SCDashboardPage />} />}
          />
          <Route
            path="/school-contact-mentor-logs"
            element={<SchoolContactRouteComponent element={<SCMentorLogsPage />} />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
