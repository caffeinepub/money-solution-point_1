import { useState, useEffect } from 'react';
import { useActor } from './useActor';

const ADMIN_SESSION_KEY = 'msp_admin_unlocked';

export function useAdminMode() {
  const { actor, isFetching: actorFetching } = useActor();
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  // Verify stored session against backend on mount/actor availability
  useEffect(() => {
    const verifySession = async () => {
      if (!actor || actorFetching) return;
      
      const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (stored === 'true') {
        try {
          const isAdmin = await actor.isCallerAdmin();
          setIsUnlocked(isAdmin);
          if (!isAdmin) {
            sessionStorage.removeItem(ADMIN_SESSION_KEY);
          }
        } catch (error) {
          console.error('Failed to verify admin status:', error);
          setIsUnlocked(false);
          sessionStorage.removeItem(ADMIN_SESSION_KEY);
        }
      } else {
        setIsUnlocked(false);
      }
      setIsLoading(false);
    };

    verifySession();
  }, [actor, actorFetching]);

  const unlock = async (password: string): Promise<boolean> => {
    if (!actor) {
      throw new Error('Actor not available');
    }

    setIsVerifying(true);
    try {
      const success = await actor.unlockAdminPrivileges(password);
      if (success) {
        setIsUnlocked(true);
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      }
      return success;
    } catch (error) {
      console.error('Admin unlock error:', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const lock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  };

  return {
    isUnlocked,
    isLoading,
    isVerifying,
    unlock,
    lock,
  };
}
