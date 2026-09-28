import { createContext, useContext, useState } from 'react';
import { loginAdmin } from '../services/api';
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const login = async creds => {
    const { token, user } = await loginAdmin(creds);
    localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); setUser(user);
  };
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };
  return <Ctx.Provider value={{ user, login, logout, isAuth: !!user }}>{children}</Ctx.Provider>;
}
