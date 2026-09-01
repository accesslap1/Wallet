import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';
import { AuthProfile, AuthSession } from './auth-models';
import { mockAuthService } from './mock-auth-service';

type AuthState = {
  session?: AuthSession;
  profiles: AuthProfile[];
  pendingProfile?: AuthProfile;
  setPendingProfile(profile?: AuthProfile): void;
  completeSignIn(profile: AuthProfile): void;
  signOut(): void;
  refreshProfiles(): void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession>();
  const [pendingProfile, setPendingProfile] = useState<AuthProfile>();
  const [profiles, setProfiles] = useState(() => mockAuthService.listProfiles());

  const value = useMemo<AuthState>(
    () => ({
      session,
      profiles,
      pendingProfile,
      setPendingProfile,
      completeSignIn: (profile) => {
        setSession({ profile, authenticatedAt: new Date().toISOString() });
        setPendingProfile(undefined);
      },
      signOut: () => {
        setSession(undefined);
        setPendingProfile(undefined);
      },
      refreshProfiles: () => setProfiles(mockAuthService.listProfiles()),
    }),
    [session, profiles, pendingProfile],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
