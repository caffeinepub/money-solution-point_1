import { useState, useEffect } from 'react';

const ADMIN_MODE_KEY = 'msp_admin_mode';

export function useAdminMode() {
  const [isAdminMode, setIsAdminMode] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_MODE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isAdminMode) {
        sessionStorage.setItem(ADMIN_MODE_KEY, 'true');
      } else {
        sessionStorage.removeItem(ADMIN_MODE_KEY);
      }
    } catch (error) {
      console.warn('Failed to update admin mode in session storage:', error);
    }
  }, [isAdminMode]);

  const login = () => setIsAdminMode(true);
  
  const logout = () => setIsAdminMode(false);

  return {
    isAdminMode,
    login,
    logout,
  };
}
