export const setUserRole = (role) => {
    localStorage.setItem('userRole', role)
  }
  
  export const getUserRole = () => {
    return localStorage.getItem('userRole')
  }
  
  export const logout = () => {
    localStorage.removeItem('userRole')
  }
  