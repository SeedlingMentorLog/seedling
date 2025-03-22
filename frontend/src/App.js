import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {AuthProvider} from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import TimeLoggedPage from './pages/TimeLoggedPage';
import YourMatchPage from './pages/YourMatchPage';
import LogTimePage from './pages/LogTimePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CalendarPage from './pages/CalendarPage';
import MentorHomePage from './pages/MentorHomePage';
import PrivateRouteComponent from "./components/PrivateRouteComponent";

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
          <Route path="/log-time" element={<PrivateRouteComponent element={<LogTimePage />} />} />
          <Route path="/time-logged" element={<PrivateRouteComponent element={<TimeLoggedPage />} />} />
          <Route path="/your-match" element={<PrivateRouteComponent element={<YourMatchPage />} />} />
          <Route path="/mentor-homepage" element={<PrivateRouteComponent element={<MentorHomePage />} />} />

          {/* Admin */}
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
