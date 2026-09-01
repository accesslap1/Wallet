import { colors, radius, typography } from '@/src/design/tokens';
import { useAuth } from '@/src/features/auth/auth-context';
import { MOCK_CODES, VerificationChannel } from '@/src/features/auth/auth-models';
import { mockAuthService } from '@/src/features/auth/mock-auth-service';
import {
  AuthBrand,
  AuthFooter,
  AuthScreen,
  AuthTabs,
  AuthTitle,
  ButtonRow,
  CodeField,
  DevelopmentCode,
  Field,
  PatternPad,
  PinPad,
  PrimaryButton,
  SecondaryButton,
} from '@/src/features/auth/auth-ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Phase = 'credentials' | 'verification' | 'security';

export default function SignIn() {
  const { profiles, pendingProfile, setPendingProfile, completeSignIn } = useAuth();
  const [phase, setPhase] = useState<Phase>('credentials');
  const [identifier, setIdentifier] = useState(pendingProfile?.email ?? '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [profile, setProfile] = useState(pendingProfile);
  const [codes, setCodes] = useState<Record<VerificationChannel, string>>({
    email: '',
    sms: '',
    authenticator: '',
  });
  const [method, setMethod] = useState<'pin' | 'pattern'>('pin');
  const [pin, setPin] = useState('');
  const [pattern, setPattern] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const verified = (channel: VerificationChannel) => mockAuthService.verifyCode(channel, codes[channel]);

  const submitCredentials = () => {
    const match = mockAuthService.authenticateCredentials(identifier, password);
    if (!match) return setMessage('The credentials do not match the development account.');
    setProfile(match);
    setPendingProfile(match);
    setMessage('');
    setPhase('verification');
  };
  const submitVerification = () => {
    if (!verified('email') || !verified('sms') || !verified('authenticator'))
      return setMessage('Complete all three development verification methods.');
    setMessage('');
    setPhase('security');
  };
  const unlock = () => {
    if (!profile) return;
    const valid =
      method === 'pin'
        ? mockAuthService.verifyPin(profile.id, pin)
        : mockAuthService.verifyPattern(profile.id, pattern);
    if (!valid) return setMessage(`${method === 'pin' ? 'PIN' : 'Pattern'} is incorrect.`);
    completeSignIn(profile);
    router.replace('/home');
  };

  return (
    <AuthScreen>
      <AuthBrand compact />
      <AuthTabs active="signin" onSignIn={() => undefined} onSignUp={() => router.replace('/signup')} />
      {phase === 'credentials' && (
        <>
          <AuthTitle
            title="Welcome back"
            subtitle="Enter your EID, username, email or phone number and password."
          />
          {profiles.length > 0 && (
            <View style={s.profileList}>
              <Text style={s.smallTitle}>Profiles on this device</Text>
              {profiles.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setIdentifier(item.email);
                    setProfile(item);
                    setPendingProfile(item);
                  }}
                  style={[s.profile, identifier === item.email && s.profileSelected]}
                >
                  <View style={s.avatar}>
                    <Text style={s.avatarText}>{item.avatarInitials}</Text>
                  </View>
                  <View style={s.profileCopy}>
                    <Text style={s.profileName}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text style={s.profileEid}>{item.eid}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={colors.grey} />
                </Pressable>
              ))}
            </View>
          )}
          <Field
            label="EID / Username / Email / Phone"
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="Enter your identity"
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />
          <View style={s.recovery}>
            <Pressable onPress={() => router.push('/forgot-eid')}>
              <Text style={s.link}>Forgot EID?</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/forgot-password')}>
              <Text style={s.link}>Forgot Password?</Text>
            </Pressable>
          </View>
          <Pressable onPress={() => setRemember((current) => !current)} style={s.remember}>
            <MaterialCommunityIcons
              name={remember ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={21}
              color={remember ? colors.blueBright : colors.grey}
            />
            <Text style={s.rememberText}>
              Remember this profile on this device (credentials are never stored)
            </Text>
          </Pressable>
          <PrimaryButton label="Continue securely" onPress={submitCredentials} />
        </>
      )}
      {phase === 'verification' && (
        <>
          <AuthTitle
            title="Verify it’s you"
            subtitle="This development flow demonstrates email, SMS/call and authenticator verification."
          />
          {(['email', 'sms', 'authenticator'] as VerificationChannel[]).map((channel) => (
            <View key={channel} style={s.verification}>
              <CodeField
                label={
                  channel === 'email'
                    ? 'Email verification'
                    : channel === 'sms'
                      ? 'SMS verification'
                      : 'Authenticator app'
                }
                code={codes[channel]}
                onChangeText={(value) => setCodes((current) => ({ ...current, [channel]: value }))}
                verified={verified(channel)}
                onSend={() => undefined}
              />
              <DevelopmentCode label={channel} code={MOCK_CODES[channel]} />
              {channel === 'sms' && (
                <Pressable style={s.call}>
                  <MaterialCommunityIcons name="phone-outline" size={16} color={colors.blueBright} />
                  <Text style={s.link}>Call me instead</Text>
                </Pressable>
              )}
            </View>
          ))}
          <ButtonRow>
            <SecondaryButton label="Back" onPress={() => setPhase('credentials')} />
            <PrimaryButton label="Verify" onPress={submitVerification} />
          </ButtonRow>
        </>
      )}
      {phase === 'security' && (
        <>
          <AuthTitle
            title={method === 'pin' ? 'Enter PIN to continue' : 'Enter pattern to continue'}
            subtitle="Complete the local security challenge registered to this profile."
          />
          {method === 'pin' ? (
            <PinPad value={pin} onChange={setPin} />
          ) : (
            <PatternPad value={pattern} onChange={setPattern} />
          )}
          <View style={s.recovery}>
            <Pressable onPress={() => setMessage('PIN recovery is not connected in this mock phase.')}>
              <Text style={s.link}>Forgot {method === 'pin' ? 'PIN' : 'Pattern'}?</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setMethod(method === 'pin' ? 'pattern' : 'pin');
                setMessage('');
              }}
            >
              <Text style={s.link}>Use {method === 'pin' ? 'Pattern' : 'PIN'} instead</Text>
            </Pressable>
          </View>
          <ButtonRow>
            <SecondaryButton label="Back" onPress={() => setPhase('verification')} />
            <PrimaryButton label="Unlock wallet" onPress={unlock} />
          </ButtonRow>
        </>
      )}
      {!!message && <Text style={s.message}>{message}</Text>}
      <SecondaryButton label="Return to welcome" danger onPress={() => router.replace('/')} />
      <AuthFooter />
    </AuthScreen>
  );
}

const s = StyleSheet.create({
  profileList: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.medium,
    overflow: 'hidden',
  },
  smallTitle: {
    ...typography.label,
    color: colors.blueBright,
    padding: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    gap: 10,
    padding: 10,
    borderTopWidth: 1,
    borderColor: colors.divider,
  },
  profileSelected: { backgroundColor: colors.blueSoft },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.label, color: colors.white },
  profileCopy: { flex: 1, gap: 2 },
  profileName: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.white },
  profileEid: { ...typography.address, color: colors.grey },
  recovery: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  link: { ...typography.label, color: colors.blueBright },
  remember: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  rememberText: { ...typography.label, color: colors.grey, flex: 1 },
  verification: { gap: 8, borderBottomWidth: 1, borderColor: colors.divider, paddingBottom: 15 },
  call: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  message: {
    ...typography.label,
    color: colors.red,
    borderLeftWidth: 2,
    borderColor: colors.red,
    padding: 10,
  },
});
