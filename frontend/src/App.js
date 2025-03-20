import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {AuthProvider} from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TimeLoggedPage from './pages/TimeLoggedPage';
import YourMatchPage from './pages/YourMatchPage';
import LogTimePage from './pages/LogTimePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/log-time" element={<LogTimePage />} />
          <Route path="/time-logged" element={<TimeLoggedPage />} />
          <Route path="/your-match" element={<YourMatchPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
