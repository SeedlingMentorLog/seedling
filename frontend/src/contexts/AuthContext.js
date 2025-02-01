import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth'; 
import {auth} from '../components/firebaseConfig'; 

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to handle Google sign-in
    const handleGoogleSignIn = async (setError, e) => {
      try {
        const provider = await new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async (result) => {
          const idToken = await result.user.getIdToken();
          const userEmail = result.user.email;
          localStorage.setItem('currentUser', JSON.stringify(result.user));
        })
      } catch (error) {
        setError({errorHeader: "Google Error", errorMessage: "Error signing in with Google"})
        // console.log("Error signing in with Google:");
        // throw error;
      }
    };

    // Function to handle Email/Password sign-in
    const handleEmailPasswordSignIn = async (email, password) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setCurrentUser(userCredential.user);
        localStorage.setItem('current', JSON.stringify(userCredential.user));
      } catch (error) {
        setError({ errorHeader: "Email/Password Sign-In Error", errorMessage: error.message });
        console.log("Error signing in with email and password: ", error);
      }
    };
    
    // Function to handle sign-out
    const handleSignOut = async () => {
      try {
        await signOut(auth);
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
      } catch (error) {
        console.log("Error signing out:", error);
        throw error;
      }
    };

    // Function to handle Google signup
    const handleGoogleSignup = async (setError) => {
      try {
          const provider = await new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const userEmail = result.user.email;
      } catch (error) {
          setError({ errorHeader: "Google Error", errorMessage: "Error signing up with Google" });
      }
    };
    
    // Effect hook to handle authentication state changes
    useEffect(() => {
      const storedUser = localStorage.getItem('currentUser');

      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
          localStorage.removeItem('currentUser');
        }
        setLoading(false);
      });
  
      return unsubscribe;
    }, []);
  
    const value = {
      currentUser,
      loading,
      handleGoogleSignIn,
      handleSignOut,
      handleGoogleSignup
    };
  
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };