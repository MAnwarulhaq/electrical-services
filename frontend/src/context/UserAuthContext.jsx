import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
} from "../services/userApi";

const UserAuthContext = createContext(null);

// ===============================
// Get User From LocalStorage
// ===============================
const getStoredUser = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");

    if (
      !userInfo ||
      userInfo === "undefined" ||
      userInfo === "null"
    ) {
      return null;
    }

    return JSON.parse(userInfo);
  } catch (error) {
    console.log("Local storage user error:", error);

    localStorage.removeItem("userInfo");

    return null;
  }
};

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());

  // ===============================
  // Login
  // ===============================
  const login = async (userData) => {
    const res = await loginUser(userData);

    console.log("Login Response:", res.data);

    // Save Token
    if (res.data.token) {
      localStorage.setItem(
        "userToken",
        res.data.token
      );
    }

    // Save User
    if (res.data.data) {
      localStorage.setItem(
        "userInfo",
        JSON.stringify(res.data.data)
      );

      setUser(res.data.data);
    }

    return res;
  };

  // ===============================
  // Register
  // ===============================
  const register = async (userData) => {
    const res = await registerUser(userData);

    console.log("Register Response:", res.data);

    if (res.data.token) {
      localStorage.setItem(
        "userToken",
        res.data.token
      );
    }

    if (res.data.data) {
      localStorage.setItem(
        "userInfo",
        JSON.stringify(res.data.data)
      );

      setUser(res.data.data);
    }

    return res;
  };

  // ===============================
  // Logout
  // ===============================
  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");

    setUser(null);
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(UserAuthContext);
};