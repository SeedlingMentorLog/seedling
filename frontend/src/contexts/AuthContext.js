import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../components/firebaseConfig";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;

      const userDetailsResponse = await fetch(
        `${process.env.REACT_APP_BACKEND}/get/user/${uid}`
      );
      if (!userDetailsResponse.ok) {
        const errorData = await userDetailsResponse.json();
        throw new Error(
          `Failed to fetch user details: ${errorData.error || userDetailsResponse.statusText}`
        );
      }

      const userDetails = await userDetailsResponse.json();
      const user = {
        ...result.user,
        id: userDetails.user.id,
        name: userDetails.user.name,
        role: userDetails.user.role,
        verified: userDetails.user.verified,
        accessToken: GoogleAuthProvider.credentialFromResult(result)?.accessToken,
      };

      localStorage.setItem("currentUser", JSON.stringify(user));
      setCurrentUser(user);
      navigate("/log-time");
    } catch (error) {
      setError({
        errorHeader: "Google Error",
        errorMessage: error.message || "Error signing in with Google",
      });
      console.error("Error during Google sign-in:", error);
    }
  };

  // Function to handle Email/Password sign-in
  const handleEmailPasswordSignIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userDetailsResponse = await fetch(
        `${process.env.REACT_APP_BACKEND}/get/user/${userCredential.user.uid}`
      );
      if (!userDetailsResponse.ok) {
        const errorData = await userDetailsResponse.json();
        throw new Error(
          `Failed to fetch user details: ${errorData.error || userDetailsResponse.statusText}`
        );
      }

      const userDetails = await userDetailsResponse.json();
      const user = {
        ...userCredential.user,
        id: userDetails.user.id,
        name: userDetails.user.name,
        role: userDetails.user.role,
        verified: userDetails.user.verified,
      };

      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/log-time");
    } catch (error) {
      setError({
        errorHeader: "Email/Password Sign-In Error",
        errorMessage: error.message,
      });
      console.log("Error signing in with email and password: ", error);
    }
  };

  // Function to handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      localStorage.removeItem("currentUser");
      navigate("/login");
    } catch (error) {
      console.log("Error signing out:", error);
      throw error;
    }
  };

  // Function to handle email/password signup
  const handleEmailPasswordSignup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/post/add_user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebase_id: userCredential.user.uid,
            email: email,
            name: "John Doe", // Add name later
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add user to database: ${errorData.error || response.statusText}`
        );
      }

      const userDetailsResponse = await response.json();
      const user = {
        ...userCredential.user,
        id: userDetailsResponse.user.id,
        name: userDetailsResponse.user.name,
        role: userDetailsResponse.user.role,
        verified: userDetailsResponse.user.verified,
      };

      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/log-time");
    } catch (error) {
      setError({
        errorHeader: "Email/Password Sign-Up Error",
        errorMessage: error.message,
      });
      console.log("Error signing up with email and password: ", error);
    }
  };

  // Function to handle Google signup
  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;
      const uid = result.user.uid;
      const userName = result.user.displayName;

      const addUserResponse = await fetch(
        `${process.env.REACT_APP_BACKEND}/post/add_user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebase_id: uid,
            email: userEmail,
            name: userName,
          }),
        }
      );

      if (!addUserResponse.ok) {
        const errorData = await addUserResponse.json();
        throw new Error(
          `Failed to add user to database: ${errorData.error || addUserResponse.statusText}`
        );
      }

      const userDetailsResponse = await addUserResponse.json();
      const user = {
        ...result.user,
        id: userDetailsResponse.user.id,
        name: userName,
        role: userDetailsResponse.user.role,
        verified: userDetailsResponse.user.verified,
        accessToken: GoogleAuthProvider.credentialFromResult(result).accessToken,
      };
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/log-time");
    } catch (error) {
      setError({
        errorHeader: "Google Error",
        errorMessage: error.message || "Error signing up with Google",
      });
      console.error("Error during Google sign-up process: ", error);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError({
        errorHeader: "Password Reset Error",
        errorMessage: error.message,
      });
    }
  };

  // Effect hook to handle authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          console.log('Attempting to fetch user details for uid:', user.uid);
          const url = `${process.env.REACT_APP_BACKEND}/get/user/${user.uid}`;
          console.log('Fetching from URL:', url);
          
          const userDetailsResponse = await fetch(url);
          console.log('Response status:', userDetailsResponse.status);
          console.log('Response headers:', Object.fromEntries(userDetailsResponse.headers.entries()));
          
          const responseText = await userDetailsResponse.text();
          console.log('Raw response:', responseText);
          
          if (!userDetailsResponse.ok) {
            throw new Error(
              `Failed to fetch user details: ${userDetailsResponse.status} ${userDetailsResponse.statusText}\nResponse: ${responseText}`
            );
          }

          let userDetails;
          try {
            userDetails = JSON.parse(responseText);
          } catch (parseError) {
            console.error('Failed to parse response as JSON:', parseError);
            throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}...`);
          }

          const mergedUser = {
            ...user,
            name: userDetails.user.name,
            role: userDetails.user.role,
            verified: userDetails.user.verified,
          };

          setCurrentUser(mergedUser);
          localStorage.setItem("currentUser", JSON.stringify(mergedUser));
        } catch (error) {
          console.error(
            "Failed to fetch user details on auth state change:",
            error.message
          );
          if (error.message.includes('Failed to fetch')) {
            console.error('Network or server error - not proceeding with navigation');
            setError({
              errorHeader: "Server Error",
              errorMessage: "Unable to connect to the server. Please try again later."
            });
          } else {
            setCurrentUser(user);
            localStorage.setItem("currentUser", JSON.stringify(user));
            navigate("/log-time");
          }
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
        navigate("/login");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    setError,
    handleEmailPasswordSignIn,
    handleEmailPasswordSignup,
    handleGoogleSignIn,
    handleSignOut,
    handleGoogleSignup,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
