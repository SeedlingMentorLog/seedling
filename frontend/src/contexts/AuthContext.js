import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { Snackbar, Alert } from "@mui/material";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      const idToken = await result.user.getIdToken();

      const userDetailsResponse = await fetch(
        `${process.env.REACT_APP_BACKEND}/get/user/${uid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      if (!userDetailsResponse.ok) {
        const errorData = await userDetailsResponse.json();
        throw new Error(
          `Failed to fetch user details: ${
            errorData.error || userDetailsResponse.statusText
          }`
        );
      }

      const userDetails = await userDetailsResponse.json();
      const user = {
        ...result.user,
        id: userDetails.user.id,
        name: userDetails.user.name,
        role: userDetails.user.role,
        verified: userDetails.user.verified,
        accessToken: idToken,
      };

      localStorage.setItem("currentUser", JSON.stringify(user));
      if (user.role === "admin" || user.role === "staff") {
        navigate("/admin-dashboard");
      } else if (user.role === "school contact") {
        navigate("/school-contact-dashboard");
      } else {
        navigate("/mentor-homepage");
      }
    } catch (error) {
      setError({
        errorHeader: "Google Error",
        errorMessage: error.message || "Error signing in with Google",
      });
      setShowError(true);
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
        `${process.env.REACT_APP_BACKEND}/get/user/${userCredential.user.uid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userCredential.user.accessToken}`,
          },
        }
      );
      if (!userDetailsResponse.ok) {
        const errorData = await userDetailsResponse.json();
        throw new Error(
          `Failed to fetch user details: ${
            errorData.error || userDetailsResponse.statusText
          }`
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

      localStorage.setItem("currentUser", JSON.stringify(user));
      if (user.role === "admin" || user.role === "staff") {
        navigate("/admin-dashboard");
      } else if (user.role === "school contact") {
        navigate("/school-contact-dashboard");
      } else {
        navigate("/mentor-homepage");
      }
    } catch (error) {
      setError({
        errorHeader: "Email/Password Sign-In Error",
        errorMessage: error.message,
      });
      setShowError(true);
      console.log("Error signing in with email and password: ", error);
    }
  };

  // Function to handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("currentUser");
      navigate("/");
    } catch (error) {
      console.log("Error signing out:", error);
      throw error;
    }
  };

  // Function to handle email/password signup
  const handleEmailPasswordSignup = async (email, password, name) => {
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
            Authorization: `Bearer ${userCredential.user.accessToken}`,
          },
          body: JSON.stringify({
            firebase_id: userCredential.user.uid,
            email: email,
            name: name,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add user to database: ${
            errorData.error || response.statusText
          }`
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

      localStorage.setItem("currentUser", JSON.stringify(user));
    } catch (error) {
      setError({
        errorHeader: "Email/Password Sign-Up Error",
        errorMessage: error.message,
      });
      setShowError(true);
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
      const idToken = await result.user.getIdToken();

      const addUserResponse = await fetch(
        `${process.env.REACT_APP_BACKEND}/post/add_user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
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
          `Failed to add user to database: ${
            errorData.error || addUserResponse.statusText
          }`
        );
      }

      const userDetailsResponse = await addUserResponse.json();
      const user = {
        ...result.user,
        id: userDetailsResponse.user.id,
        name: userName,
        role: userDetailsResponse.user.role,
        verified: userDetailsResponse.user.verified,
        accessToken: idToken,
      };
      localStorage.setItem("currentUser", JSON.stringify(user));
    } catch (error) {
      setError({
        errorHeader: "Google Error",
        errorMessage: error.message || "Error signing up with Google",
      });
      setShowError(true);
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
      setShowError(true);
    }
  };

  const closeError = () => {
    setError(null);
    setShowError(false);
  };

  // Effect hook to handle authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const url = `${process.env.REACT_APP_BACKEND}/get/user/${user.uid}`;

          const userDetailsResponse = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
          });

          const responseText = await userDetailsResponse.text();

          if (!userDetailsResponse.ok) {
            throw new Error(
              `Failed to fetch user details: ${userDetailsResponse.status} ${userDetailsResponse.statusText}\nResponse: ${responseText}`
            );
          }

          let userDetails;
          try {
            userDetails = JSON.parse(responseText);
          } catch (parseError) {
            console.error("Failed to parse response as JSON:", parseError);
            throw new Error(
              `Invalid JSON response from server: ${responseText.substring(
                0,
                100
              )}...`
            );
          }

          const mergedUser = {
            ...user,
            id: userDetails.user.id,
            name: userDetails.user.name,
            role: userDetails.user.role,
            verified: userDetails.user.verified,
          };

          localStorage.setItem("currentUser", JSON.stringify(mergedUser));
        } catch (error) {
          console.error(
            "Failed to fetch user details on auth state change:",
            error.message
          );
          if (error.message.includes("Failed to fetch")) {
            console.error(
              "Network or server error - not proceeding with navigation"
            );
            setError({
              errorHeader: "Server Error",
              errorMessage:
                "Unable to connect to the server. Please try again later.",
            });
            setShowError(true);
          } else {
            localStorage.setItem("currentUser", JSON.stringify(user));
            navigate("/log-time");
          }
        }
      } else {
        localStorage.removeItem("currentUser");
        navigate("/");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    loading,
    error,
    showError,
    setError,
    setShowError,
    handleEmailPasswordSignIn,
    handleEmailPasswordSignup,
    handleGoogleSignIn,
    handleSignOut,
    handleGoogleSignup,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={closeError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {error && (
          <Alert onClose={closeError} severity="error" sx={{ width: "100%" }}>
            {error.errorHeader}: {error.errorMessage}
          </Alert>
        )}
      </Snackbar>
    </AuthContext.Provider>
  );
};
