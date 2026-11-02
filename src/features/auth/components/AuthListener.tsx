import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../../../lib/supabase';
import { setSession, setAuthLoading } from '../authSlice';
import type { UserRole } from '../authSlice';

interface AuthListenerProps {
  children: React.ReactNode;
}

export default function AuthListener({ children }: AuthListenerProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial explicit verification (prevents bug when hard refreshing the page and the user is logged in, but the state is not yet updated)
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        dispatch(setSession({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || 'Medical User',
          role: (session.user.user_metadata?.role || 'Doctor') as UserRole,
          avatarUrl: session.user.user_metadata?.avatar_url,
        }));
      }
      
      // Whether there is a session or not, we tell Redux to stop showing the loader.
      dispatch(setAuthLoading(false));
    };

    checkInitialSession();

    // Listen auth changes (login, logout, refresh token, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setSession({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || 'Medical User',
          role: (session.user.user_metadata?.role || 'Doctor') as UserRole,
          avatarUrl: session.user.user_metadata?.avatar_url,
        }));
      } else {
        dispatch(setSession(null));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
}