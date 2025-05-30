import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";

const AdminRouteComponent = ({ element }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const { setError, setShowError, handleSignOut } = useAuth();
  const errorSet = useRef(false);

  useEffect(() => {
    // Only set the error once to avoid infinite loops
    if (!errorSet.current) {
      if (!currentUser) {
        setError({
          errorHeader: "Login Error",
          errorMessage: "You must be logged in to access this page.",
        });
        setShowError(true);
        errorSet.current = true;
      } else if (!currentUser?.verified) {
        setError({
          errorHeader: "Verification Error",
          errorMessage: "You must be verified by a Seedling Admin to log in.",
        });
        setShowError(true);
        handleSignOut();
        errorSet.current = true;
      } else if (currentUser?.role !== "admin" && currentUser?.role !== "staff") {
        setError({
          errorHeader: "Access Denied",
          errorMessage: "You do not have permission to access this page.",
        });
        setShowError(true);
        handleSignOut();
        errorSet.current = true;
      }
    }
  }, [currentUser, setError, setShowError]);

  if (!currentUser || !currentUser?.verified) {
    return <Navigate to="/" />;
  }

  return element;
};

export default AdminRouteComponent;
