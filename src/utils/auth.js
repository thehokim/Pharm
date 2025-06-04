export const setUserRole = (role) => {
  localStorage.setItem("userRole", role);
};

export const getUserRole = () => {
  return localStorage.getItem("userRole");
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("userRole");
  localStorage.removeItem("token");
};

  
export const BASE_URL = "http://127.0.0.1:9000";
