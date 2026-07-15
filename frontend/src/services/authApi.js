// import api from "./api";

// export const loginAdmin = async (credentials) => {
//   const { data } = await api.post("/auth/login", credentials);
//   return data;
// };

// export const getAdminProfile = async () => {
//   const { data } = await api.get("/auth/profile");
//   return data;
// };

import api from "./api";

export const loginAdmin = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const getAdminProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};