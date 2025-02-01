import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {AuthProvider} from './components/AuthContext';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <div> Hello World! </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
