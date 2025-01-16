import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // Custom context for authentication

function App() {
  return (
    <Router>
      <AuthProvider>
        <div> Hello World! </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
