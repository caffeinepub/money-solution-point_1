import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'MSP508';
const ADMIN_SESSION_KEY = 'msp_admin_unlocked';

export function useAdminMode() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check session storage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
    setIsUnlocked(stored === 'true');
    setIsLoading(false);
  }, []);

  const unlock = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  };

  const lock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  };

  return {
    isUnlocked,
    isLoading,
    unlock,
    lock,
  };
}
