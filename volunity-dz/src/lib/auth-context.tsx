'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/database.types';
import type { User, Session } from '@supabase/supabase-js';

type SignUpData = {
  email: string;
  password: string;
  full_name: string;
  university?: string;
  faculty?: string;
  department?: string;
  academic_year?: string;
};

type AuthState = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

type AuthActions = {
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error?: string }>;
};

type AuthContextValue = AuthState & AuthActions;

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = React.useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const [prevSession, setPrevSession] = React.useState<string | null>(null);

  const loadProfile = React.useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setState((prev) => ({ ...prev, profile: data as Profile }));
    }
    return data as Profile | null;
  }, [supabase]);

  React.useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setState({
          user: session.user,
          profile: null,
          session,
          isLoading: true,
          isAuthenticated: true,
        });
        await loadProfile(session.user.id);
      }

      setState((prev) => ({ ...prev, isLoading: false }));
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const sessionId = session?.access_token ?? null;
        if (sessionId === prevSession) return;
        setPrevSession(sessionId);

        if (session?.user) {
          setState({
            user: session.user,
            profile: null,
            session,
            isLoading: false,
            isAuthenticated: true,
          });
          await loadProfile(session.user.id);
        } else {
          setState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile, prevSession]);

  const refreshProfile = React.useCallback(async () => {
    if (!state.user) return;
    await loadProfile(state.user.id);
  }, [state.user, loadProfile]);

  const signUp = React.useCallback(
    async (data: SignUpData) => {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            university: data.university || null,
            faculty: data.faculty || null,
            department: data.department || null,
            academic_year: data.academic_year || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) return { error: error.message };
      if (!authData.user) return { error: 'Registration failed' };

      return {};
    },
    [supabase]
  );

  const signIn = React.useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return {};
    },
    [supabase]
  );

  const signInWithGoogle = React.useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, [supabase]);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
    router.refresh();
  }, [supabase, router]);

  const updateProfile = React.useCallback(
    async (data: Partial<Profile>) => {
      if (!state.user) return { error: 'Not authenticated' };

      const { error } = await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', state.user.id);

      if (error) return { error: error.message };

      await refreshProfile();
      return {};
    },
    [supabase, state.user, refreshProfile]
  );

  const value = React.useMemo(
    () => ({
      ...state,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      refreshProfile,
      updateProfile,
    }),
    [state, signUp, signIn, signInWithGoogle, signOut, refreshProfile, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
