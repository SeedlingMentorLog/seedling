import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {AuthProvider} from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TimeLoggedPage from './pages/TimeLoggedPage';
import YourMatchPage from './pages/YourMatchPage';
import TimeLogPage from './pages/TimeLogPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/time-log" element={<TimeLogPage />} />
          <Route path="/time-logged" element={<TimeLoggedPage />} />
          <Route path="/your-match" element={<YourMatchPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
