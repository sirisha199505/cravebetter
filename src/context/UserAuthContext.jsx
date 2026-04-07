import { createContext, useContext, useState } from 'react';

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('cb_user_token') || null);
  const [userInfo, setUserInfo] = useState(() => {
    const s = localStorage.getItem('cb_user_info');
    return s ? JSON.parse(s) : null;
  });
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const loginUser = (tok, info) => {
    localStorage.setItem('cb_user_token', tok);
    localStorage.setItem('cb_user_info', JSON.stringify(info));
    setToken(tok);
    setUserInfo(info);
    setShowAuthPopup(false);
  };

  const logoutUser = () => {
    localStorage.removeItem('cb_user_token');
    localStorage.removeItem('cb_user_info');
    setToken(null);
    setUserInfo(null);
  };

  return (
    <UserAuthContext.Provider value={{
      token,
      userInfo,
      isLoggedIn: !!token,
      loginUser,
      logoutUser,
      showAuthPopup,
      setShowAuthPopup,
    }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
