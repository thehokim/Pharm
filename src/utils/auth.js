export const setUserRole = (role) => {
  localStorage.setItem("userRole", role);
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

  export const getUserRole = () => {
    return localStorage.getItem('userRole')
  }
  
  export const logout = () => {
    localStorage.removeItem('userRole')
  }
  
export const BASE_URL = "http://192.168.20.5:8000";
