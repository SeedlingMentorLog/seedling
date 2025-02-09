import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {AuthProvider} from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import TimeLoggedPage from './components/TimeLoggedPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/time-logged" element={<TimeLoggedPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
