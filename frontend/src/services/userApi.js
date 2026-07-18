import api from "./api";

// ===============================
// Register User
// POST /api/users/register
// ===============================
export const registerUser = (userData) => {
  return api.post("/users/register", userData);
};

// ===============================
// Login User
// POST /api/users/login
// ===============================
export const loginUser = (userData) => {
  return api.post("/users/login", userData);
};

// ===============================
// Get User Profile
// GET /api/users/profile
// ===============================
export const getUserProfile = () => {
  const token = localStorage.getItem("userToken");

  return api.get("/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ===============================
// Update Profile
// PUT /api/users/profile
// ===============================
export const updateUserProfile = (userData) => {
  const token = localStorage.getItem("userToken");

  return api.put("/users/profile", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ===============================
// Change Password
// PUT /api/users/change-password
// ===============================
export const changePassword = (passwordData) => {
  const token = localStorage.getItem("userToken");

  return api.put("/users/change-password", passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ===============================
// My Bookings
// GET /api/users/bookings
// ===============================
export const getMyBookings = () => {
  const token = localStorage.getItem("userToken");

  return api.get("/users/bookings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ===============================
// Delete Account
// DELETE /api/users/profile
// ===============================
export const deleteUserAccount = () => {
  const token = localStorage.getItem("userToken");

  return api.delete("/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ===============================
// Logout User
// ===============================
export const logoutUser = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userInfo");
};