import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
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
  const handleGoogleSignIn = async (setError, e) => {
    try {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider).then(async (result) => {
        const uid = result.user.uid;

        // Append user info to the user object
        const userDetailsResponse = await fetch(`/user/${uid}`);
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
          name: result.user.displayName,
          role: userDetails.user.role,
          verified: userDetails.user.verified,
          accessToken:
            GoogleAuthProvider.credentialFromResult(result).accessToken,
        };

        localStorage.setItem("currentUser", JSON.stringify(user));
        setCurrentUser(user);
      });
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

      // Append user info to the user object
      const userDetailsResponse = await fetch(
        `/get/user/${userCredential.user.uid}`
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
      userCredential.user.id = userDetails.user.id;
      userCredential.user.name = userDetails.user.name;
      userCredential.user.role = userDetails.user.role;
      userCredential.user.verified = userDetails.user.verified;

      setCurrentUser(userCredential.user);
      localStorage.setItem("current", JSON.stringify(userCredential.user));
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

      // Adding user to the db
      const response = await fetch("/post/add_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebase_id: userCredential.user.uid,
          email: email,
          name: "John Doe", // Add name later
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add user to database: ${
            errorData.error || response.statusText
          }`
        );
      }

      // Append user info to the user object
      const userDetailsResponse = await fetch(
        `/get/user/${userCredential.user.uid}`
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
      userCredential.user.id = userDetails.user.id;
      userCredential.user.name = userDetails.user.name;
      userCredential.user.role = userDetails.user.role;
      userCredential.user.verified = userDetails.user.verified;

      setCurrentUser(userCredential.user);
      localStorage.setItem("currentUser", JSON.stringify(userCredential.user));
    } catch (error) {
      setError({
        errorHeader: "Email/Password Sign-Up Error",
        errorMessage: error.message,
      });
      console.log("Error signing up with email and password: ", error);
    }
  };

  // Function to handle Google signup
  const handleGoogleSignup = async (setError) => {
    try {
      // Sign up with Google
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;
      const uid = result.user.uid;
      const userName = result.user.displayName;

      // Adding user to the db
      const addUserResponse = await fetch("/add_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebase_id: uid,
          email: userEmail,
          name: userName,
        }),
      });

      if (!addUserResponse.ok) {
        const errorData = await addUserResponse.json();
        throw new Error(
          `Failed to add user to database: ${
            errorData.error || addUserResponse.statusText
          }`
        );
      }

      console.log("User added to database successfully");

      // Append user info to the user object
      const userDetailsResponse = await fetch(`/user/${uid}`);
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
        name: userName,
        role: userDetails.user.role,
        verified: userDetails.user.verified,
        accessToken:
          GoogleAuthProvider.credentialFromResult(result).accessToken,
      };
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      console.log("User signed up and state updated:", user);
    } catch (error) {
      setError({
        errorHeader: "Google Error",
        errorMessage: error.message || "Error signing up with Google",
      });
      console.error("Error during Google sign-up process: ", error);
    }
  };

  // Effect hook to handle authentication state changes
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("currentUser");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    handleEmailPasswordSignIn,
    handleEmailPasswordSignup,
    handleGoogleSignIn,
    handleSignOut,
    handleGoogleSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
