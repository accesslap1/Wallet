import { AuthProfile, SignUpDraft, VerificationChannel } from './auth-models';

// Development-only one-way hash. Production credentials must be verified by an audited backend.
export function hashSecret(value: string) {
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    first = Math.imul(first ^ code, 0x01000193);
    second = Math.imul(second ^ (code + index), 0x85ebca6b);
  }
  return `${(first >>> 0).toString(16).padStart(8, '0')}${(second >>> 0).toString(16).padStart(8, '0')}`;
}

type StoredUser = AuthProfile & {
  identifierHashes: string[];
  passwordHash: string;
  pinHash: string;
  patternHash: string;
};

const DEMO_PROFILE: AuthProfile = {
  id: 'profile-demo',
  eid: 'Authenticated profile',
  firstName: 'Egety',
  lastName: 'User',
  email: '',
  phone: '',
  username: '',
  avatarInitials: 'EU',
};

const users: StoredUser[] = [
  {
    ...DEMO_PROFILE,
    identifierHashes: ['9b306782c008c360', 'fa2a699012a54826', '820f2517ba1a18c2', 'fc57128d66d626a2'],
    passwordHash: 'f6a719d1d3f4a75c',
    pinHash: 'cfef990e4e1b4302',
    patternHash: '57d89804ac31b18d',
  },
];

const normalize = (value: string) => value.trim().toLowerCase();
const findUser = (identifier: string) => {
  const target = normalize(identifier);
  const targetHash = hashSecret(target);
  return users.find((user) => user.identifierHashes.includes(targetHash));
};

const verificationHashes: Record<VerificationChannel, string> = {
  email: '7bc11fae126bc123',
  sms: '3470131245ebb673',
  authenticator: 'de34ed6dd1faed14',
};

export class MockAuthService {
  listProfiles(): AuthProfile[] {
    return users.map(
      ({
        identifierHashes: _identifiers,
        passwordHash: _password,
        pinHash: _pin,
        patternHash: _pattern,
        ...profile
      }) => profile,
    );
  }

  authenticateCredentials(identifier: string, password: string): AuthProfile | undefined {
    const user = findUser(identifier);
    return user && user.passwordHash === hashSecret(password) ? this.publicProfile(user) : undefined;
  }

  verifyCode(channel: VerificationChannel, code: string) {
    return verificationHashes[channel] === hashSecret(code.replace(/\s/g, ''));
  }

  verifyPin(profileId: string, pin: string) {
    return users.find((user) => user.id === profileId)?.pinHash === hashSecret(pin);
  }

  verifyPattern(profileId: string, pattern: number[]) {
    return users.find((user) => user.id === profileId)?.patternHash === hashSecret(pattern.join('-'));
  }

  resetPassword(identifier: string, password: string) {
    const user = findUser(identifier);
    if (!user) return false;
    user.passwordHash = hashSecret(password);
    return true;
  }

  register(draft: SignUpDraft): AuthProfile {
    const sequence = String(700841627 + users.length).padStart(9, '0');
    const profile: AuthProfile = {
      id: `profile-${sequence}`,
      eid: `EID-${sequence}`,
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: normalize(draft.email),
      phone: '',
      username: `${normalize(draft.firstName)}${normalize(draft.lastName)}`.replace(/[^a-z0-9]/g, ''),
      avatarInitials: `${draft.firstName[0] ?? ''}${draft.lastName[0] ?? ''}`.toUpperCase(),
    };
    users.push({
      ...profile,
      identifierHashes: [profile.eid, profile.email, profile.phone, profile.username]
        .filter(Boolean)
        .map((value) => hashSecret(normalize(value))),
      passwordHash: hashSecret(draft.password),
      pinHash: hashSecret(draft.pin),
      patternHash: hashSecret(draft.pattern.join('-')),
    });
    return profile;
  }

  hasRecoveryIdentity(identifier: string) {
    return !!findUser(identifier);
  }

  private publicProfile(user: StoredUser): AuthProfile {
    const {
      identifierHashes: _identifiers,
      passwordHash: _password,
      pinHash: _pin,
      patternHash: _pattern,
      ...profile
    } = user;
    return profile;
  }
}

export const mockAuthService = new MockAuthService();
