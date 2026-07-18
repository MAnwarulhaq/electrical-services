import { Navigate, useLocation } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  // Token jo login ke baad save hoga
  const token = localStorage.getItem("userToken");

  const location = useLocation();

  // Agar login nahi hai to login page par bhej do
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Login hai to page show karo
  return children;
};

export default UserProtectedRoute;