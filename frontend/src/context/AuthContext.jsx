import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginAdmin,
  getAdminProfile,
} from "../services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getAdminProfile();
        setAdmin(response.data);
      } catch (error) {
        console.error("Authentication Error:", error);

        localStorage.removeItem("adminToken");
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await loginAdmin({
      email,
      password,
    });

    const token =
      response.token || response.data?.token;

    if (!token) {
      throw new Error("Authentication token not received");
    }

    localStorage.setItem("adminToken", token);

    setAdmin(
      response.data?.admin ||
        response.admin ||
        response.data
    );

    return response;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};