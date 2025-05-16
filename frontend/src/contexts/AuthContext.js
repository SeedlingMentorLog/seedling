import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  sendPasswordResetEmail,
  getRedirectResult,
  setPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { Snackbar, Alert } from "@mui/material";
import { isMobile } from "react-device-detect";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [handlingRedirect, setHandlingRedirect] = useState(true);

  /* ------------------------------------------------------------------
     1.  Give iOS Safari a persistence that survives the Google redirect.
         If IndexedDB / localStorage are blocked (private-mode), fall back
         to in-memory so at least getRedirectResult works.
  -------------------------------------------------------------------*/
  useEffect(() => {
    (async () => {
      try {
        await setPersistence(auth, browserSessionPersistence);
      } catch (err) {
        console.warn(
          "browserSessionPersistence failed, falling back to in-memory.",
          err
        );
        await setPersistence(auth, inMemoryPersistence);
      }
    })();
  }, []);

  /* ------------------------------------------------------------------
     2.  GOOGLE SIGN-IN (LOGIN)
  -------------------------------------------------------------------*/
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();

      if (isMobile) {
        await signInWithRedirect(auth, provider);
        return; // iOS/Android path: rest handled
      }

      // Desktop popup path
      const result = await signInWithPopup(auth, provider);
      await finishSignIn(result.user);
    } catch (err) {
      handleAuthError("Google Sign-In Error", err);
    }
  };

  /* ------------------------------------------------------------------
     3.  EMAIL / PASSWORD LOGIN
  -------------------------------------------------------------------*/
  const handleEmailPasswordSignIn = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await finishSignIn(cred.user);
    } catch (err) {
      handleAuthError("Email/Password Sign-In Error", err);
    }
  };

  /* ------------------------------------------------------------------
     4.  SIGN-OUT
  -------------------------------------------------------------------*/
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("currentUser");
      navigate("/login");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  /* ------------------------------------------------------------------
     5.  EMAIL / PASSWORD SIGN-UP
  -------------------------------------------------------------------*/
  const handleEmailPasswordSignup = async (email, password, name) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await finishSignup(cred.user, name);
    } catch (err) {
      handleAuthError("Email/Password Sign-Up Error", err);
    }
  };

  /* ------------------------------------------------------------------
     6.  GOOGLE SIGN-UP (POPUP on desktop, REDIRECT on mobile)
  -------------------------------------------------------------------*/
  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();

      if (isMobile) {
        await signInWithRedirect(auth, provider);
        return;
      }

      const result = await signInWithPopup(auth, provider);
      await finishSignup(result.user, result.user.displayName);
    } catch (err) {
      handleAuthError("Google Sign-Up Error", err);
    }
  };

  /* ------------------------------------------------------------------
     7.  PASSWORD RESET
  -------------------------------------------------------------------*/
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      handleAuthError("Password Reset Error", err);
    }
  };

  const closeError = () => {
    setError(null);
    setShowError(false);
  };

  /* ------------------------------------------------------------------
     8.  HANDLE GOOGLE REDIRECT RESULT   (mobile Safari / Chrome iOS)
  -------------------------------------------------------------------*/
  useEffect(() => {
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const idToken = await result.user.getIdToken();
          const uid = result.user.uid;
          const email = result.user.email;
          const name = result.user.displayName;

          let userData;

          // --- get user row from DB ------------------------------------------------
          const res = await fetch(
            `${process.env.REACT_APP_BACKEND}/get/user/${uid}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
            }
          );

          if (res.ok) {
            userData = await res.json();
          } else if (res.status === 404) {
            // --- add user row to DB ------------------------------------------------
            const addRes = await fetch(
              `${process.env.REACT_APP_BACKEND}/post/add_user`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ firebase_id: uid, email, name }),
              }
            );

            if (!addRes.ok) {
              const errText = await addRes.text();
              throw new Error(
                `Failed to add user to database: ${addRes.status} ${addRes.statusText}\n${errText}`
              );
            }

            userData = await addRes.json();
          } else {
            throw new Error("Unexpected error fetching user data");
          }

          const user = {
            ...result.user,
            id: userData.user.id,
            name: userData.user.name,
            role: userData.user.role,
            verified: userData.user.verified,
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

          setLoading(false);
        }
      } catch (err) {
        handleAuthError("Redirect Auth Error", err);
      } finally {
        setHandlingRedirect(false); //  FIX: allow onAuthStateChanged
      }
    })();
  }, []);

  /* ------------------------------------------------------------------
     9.  GLOBAL AUTH STATE LISTENER
         Skip the initial “null” while we’re still checking redirect.
  -------------------------------------------------------------------*/
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (handlingRedirect) return; //  FIX: wait for step 8 first

      if (user) {
        try {
          await finishSignIn(user); // will no-op if already in localStorage
        } catch (err) {
          handleAuthError("Auth State Error", err);
        }
      } else {
        localStorage.removeItem("currentUser");
        if (window.location.pathname !== "/login") navigate("/login");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [handlingRedirect, navigate]);

  /* ------------------------------------------------------------------
     10.  HELPERS
  -------------------------------------------------------------------*/
  const finishSignIn = async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken();

    // --- get user row from DB ------------------------------------------------
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND}/get/user/${firebaseUser.uid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(
        `Failed to fetch user details: ${res.status} ${res.statusText}\n${errText}`
      );
    }

    const dbUser = await res.json();

    const merged = {
      ...firebaseUser,
      id: dbUser.user.id,
      name: dbUser.user.name,
      role: dbUser.user.role,
      verified: dbUser.user.verified,
      accessToken: idToken,
    };

    localStorage.setItem("currentUser", JSON.stringify(merged));

    // --- role-based routing ---------------------------------------------------
    if (merged.role === "admin" || merged.role === "staff") {
      navigate("/admin-dashboard");
    } else if (merged.role === "school contact") {
      navigate("/school-contact-dashboard");
    } else {
      navigate("/mentor-homepage");
    }
  };

  const finishSignup = async (firebaseUser, name) => {
    const idToken = await firebaseUser.getIdToken();

    // --- create user row in DB ----------------------------------------------
    const res = await fetch(`${process.env.REACT_APP_BACKEND}/post/add_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        firebase_id: firebaseUser.uid,
        email: firebaseUser.email,
        name,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(
        `Failed to add user to database: ${res.status} ${res.statusText}\n${errText}`
      );
    }

    const dbUser = await res.json();

    const merged = {
      ...firebaseUser,
      id: dbUser.user.id,
      name: dbUser.user.name,
      role: dbUser.user.role,
      verified: dbUser.user.verified,
      accessToken: idToken,
    };

    localStorage.setItem("currentUser", JSON.stringify(merged));

    // --- role-based routing ---------------------------------------------------
    if (merged.role === "admin" || merged.role === "staff") {
      navigate("/admin-dashboard");
    } else if (merged.role === "school contact") {
      navigate("/school-contact-dashboard");
    } else {
      navigate("/mentor-homepage");
    }
  };

  const handleAuthError = (header, err) => {
    console.error(header, err);
    setError({ errorHeader: header, errorMessage: err.message });
    setShowError(true);
  };

  /* ------------------------------------------------------------------
     11.  CONTEXT VALUE + UI
  -------------------------------------------------------------------*/
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
        autoHideDuration={8000}
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
