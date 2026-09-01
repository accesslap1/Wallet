export type VerificationChannel = 'email' | 'sms' | 'authenticator';

export type AuthProfile = {
  id: string;
  eid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  avatarInitials: string;
};

export type SignUpDraft = {
  firstName: string;
  lastName: string;
  sponsor: string;
  gender: 'male' | 'female' | '';
  country: string;
  dateOfBirth: string;
  email: string;
  password: string;
  pin: string;
  pattern: number[];
};

export type AuthSession = {
  profile: AuthProfile;
  authenticatedAt: string;
};

export const passwordChecks = (value: string, confirmation = value) => ({
  capitals: (value.match(/[A-Z]/g) ?? []).length >= 2,
  lowercase: (value.match(/[a-z]/g) ?? []).length >= 2,
  numbers: (value.match(/[0-9]/g) ?? []).length >= 2,
  special: (value.match(/[^A-Za-z0-9]/g) ?? []).length >= 2,
  length: value.length >= 10,
  matches: value.length > 0 && value === confirmation,
});

export const isStrongPassword = (value: string, confirmation = value) =>
  Object.values(passwordChecks(value, confirmation)).every(Boolean);

export const isValidPattern = (value: number[]) => value.length >= 4 && new Set(value).size === value.length;
