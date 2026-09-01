import { colors, typography } from '@/src/design/tokens';
import {
  SignUpDraft,
  isStrongPassword,
  isValidPattern,
  passwordChecks,
} from '@/src/features/auth/auth-models';
import { useAuth } from '@/src/features/auth/auth-context';
import { mockAuthService } from '@/src/features/auth/mock-auth-service';
import {
  AuthBrand,
  AuthFooter,
  AuthScreen,
  AuthTabs,
  AuthTitle,
  ButtonRow,
  Choice,
  CodeField,
  Field,
  PatternPad,
  PinPad,
  PrimaryButton,
  SecondaryButton,
  SignupProgress,
} from '@/src/features/auth/auth-ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const initialDraft: SignUpDraft = {
  firstName: '',
  lastName: '',
  sponsor: '',
  gender: '',
  country: '',
  dateOfBirth: '',
  email: '',
  password: '',
  pin: '',
  pattern: [],
};

export default function SignUp() {
  const { refreshProfiles, setPendingProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(initialDraft);
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [terms, setTerms] = useState(false);
  const [pinConfirmation, setPinConfirmation] = useState('');
  const [pinPhase, setPinPhase] = useState<'register' | 'confirm'>('register');
  const [patternConfirmation, setPatternConfirmation] = useState<number[]>([]);
  const [patternPhase, setPatternPhase] = useState<'register' | 'confirm'>('register');
  const [message, setMessage] = useState('');
  const [createdEid, setCreatedEid] = useState('');
  const update = <K extends keyof SignUpDraft>(key: K, value: SignUpDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const checks = passwordChecks(draft.password, confirmation);

  const next = () => {
    setMessage('');
    if (step === 0) {
      if (!draft.firstName.trim() || !draft.lastName.trim() || !draft.gender)
        return setMessage('Enter your legal name and official gender.');
      setStep(1);
    } else if (step === 1) {
      if (!draft.country || !draft.dateOfBirth || !draft.email.includes('@') || !emailVerified)
        return setMessage('Complete your contact details and verify your email.');
      setStep(2);
    } else if (step === 2) {
      if (!isStrongPassword(draft.password, confirmation) || !terms)
        return setMessage('Meet every password requirement and accept the terms.');
      setStep(3);
    } else if (step === 3) {
      if (pinPhase === 'register') {
        if (draft.pin.length !== 4) return setMessage('Enter a four-digit PIN.');
        setPinPhase('confirm');
      } else {
        if (pinConfirmation !== draft.pin) return setMessage('PIN confirmation does not match.');
        setStep(4);
      }
    } else if (step === 4) {
      if (patternPhase === 'register') {
        if (!isValidPattern(draft.pattern)) return setMessage('Select at least four unique pattern dots.');
        setPatternPhase('confirm');
      } else {
        if (patternConfirmation.join('-') !== draft.pattern.join('-'))
          return setMessage('Pattern confirmation does not match.');
        const profile = mockAuthService.register(draft);
        refreshProfiles();
        setPendingProfile(profile);
        setCreatedEid(profile.eid);
        setStep(5);
      }
    }
  };

  const back = () => {
    setMessage('');
    if (step === 3 && pinPhase === 'confirm') return setPinPhase('register');
    if (step === 4 && patternPhase === 'confirm') return setPatternPhase('register');
    if (step > 0) setStep((current) => current - 1);
    else router.back();
  };

  if (step === 5) {
    return (
      <AuthScreen>
        <AuthBrand />
        <View style={s.successIcon}>
          <MaterialCommunityIcons name="shield-check-outline" size={72} color={colors.blueBright} />
        </View>
        <AuthTitle
          title="Congratulations, you’re in"
          subtitle="Your Egety identity has been created successfully."
        />
        <View style={s.eidBox}>
          <Text style={s.eidLabel}>YOUR EGETY ID</Text>
          <Text selectable style={s.eid}>
            {createdEid}
          </Text>
        </View>
        <Text style={s.helper}>
          Keep your EID available. It identifies your profile across Egety services, while your password and
          local security methods protect access.
        </Text>
        <PrimaryButton label="Continue to sign in" onPress={() => router.replace('/signin')} />
        <AuthFooter />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <AuthBrand compact />
      <AuthTabs active="signup" onSignIn={() => router.replace('/signin')} onSignUp={() => undefined} />
      <SignupProgress step={step} />
      {step === 0 && <ProfileStep draft={draft} update={update} />}
      {step === 1 && (
        <>
          <AuthTitle
            title="Your digital pass"
            subtitle="Tell us where you live, when you were born and where we can reach you."
          />
          <Field
            label="Country of residence"
            placeholder="Lebanon"
            value={draft.country}
            onChangeText={(value) => update('country', value)}
          />
          <Field
            label="Date of birth"
            placeholder="YYYY-MM-DD"
            value={draft.dateOfBirth}
            onChangeText={(value) => update('dateOfBirth', value)}
            keyboardType="numbers-and-punctuation"
          />
          <Field
            label="Email"
            placeholder="name@example.com"
            value={draft.email}
            onChangeText={(value) => {
              update('email', value);
              setEmailVerified(false);
            }}
            keyboardType="email-address"
          />
          <CodeField
            label="Email verification"
            code={emailCode}
            onChangeText={(value) => {
              setEmailCode(value);
              setEmailVerified(mockAuthService.verifyCode('email', value));
            }}
            verified={emailVerified}
            onSend={() => undefined}
          />
        </>
      )}
      {step === 2 && (
        <>
          <AuthTitle
            title="Protect your access"
            subtitle="Create a strong password for your Egety identity."
          />
          <Field
            label="Password"
            secureTextEntry
            value={draft.password}
            onChangeText={(value) => update('password', value)}
            placeholder="Create password"
          />
          <Field
            label="Confirm password"
            secureTextEntry
            value={confirmation}
            onChangeText={setConfirmation}
            placeholder="Repeat password"
          />
          <Pressable
            onPress={() => {
              update('password', 'Wallet#Secure!26');
              setConfirmation('Wallet#Secure!26');
            }}
            style={s.generate}
          >
            <MaterialCommunityIcons name="auto-fix" size={17} color={colors.blueBright} />
            <Text style={s.generateText}>Generate a development password</Text>
          </Pressable>
          <View style={s.rules}>
            {Object.entries(checks).map(([key, passed]) => (
              <View key={key} style={s.rule}>
                <MaterialCommunityIcons
                  name={passed ? 'check-circle' : 'circle-outline'}
                  size={16}
                  color={passed ? colors.blueBright : colors.grey}
                />
                <Text style={[s.ruleText, passed && s.rulePassed]}>{ruleLabel[key]}</Text>
              </View>
            ))}
          </View>
          <Pressable onPress={() => setTerms((current) => !current)} style={s.terms}>
            <MaterialCommunityIcons
              name={terms ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={22}
              color={terms ? colors.blueBright : colors.grey}
            />
            <Text style={s.termsText}>I accept the Terms & Conditions and Privacy Policy.</Text>
          </Pressable>
        </>
      )}
      {step === 3 && (
        <>
          <AuthTitle
            title="Register PIN"
            subtitle="Create a four-digit local security challenge, then confirm it."
          />
          <PinPad
            title={pinPhase === 'register' ? 'Register PIN' : 'Confirm PIN'}
            value={pinPhase === 'register' ? draft.pin : pinConfirmation}
            onChange={(value) => (pinPhase === 'register' ? update('pin', value) : setPinConfirmation(value))}
          />
        </>
      )}
      {step === 4 && (
        <>
          <AuthTitle
            title="Register pattern"
            subtitle="Choose at least four dots, then repeat the same sequence."
          />
          <PatternPad
            title={patternPhase === 'register' ? 'Register pattern' : 'Confirm pattern'}
            value={patternPhase === 'register' ? draft.pattern : patternConfirmation}
            onChange={(value) =>
              patternPhase === 'register' ? update('pattern', value) : setPatternConfirmation(value)
            }
          />
        </>
      )}
      {!!message && <Text style={s.message}>{message}</Text>}
      <ButtonRow>
        <SecondaryButton label="Back" onPress={back} />
        <PrimaryButton
          label={
            step >= 3 &&
            ((step === 3 && pinPhase === 'register') || (step === 4 && patternPhase === 'register'))
              ? 'Confirm'
              : step === 4
                ? 'Create profile'
                : 'Next'
          }
          onPress={next}
        />
      </ButtonRow>
      <SecondaryButton label="Cancel signup" danger onPress={() => router.replace('/')} />
      <AuthFooter />
    </AuthScreen>
  );
}

function ProfileStep({
  draft,
  update,
}: {
  draft: SignUpDraft;
  update<K extends keyof SignUpDraft>(key: K, value: SignUpDraft[K]): void;
}) {
  return (
    <>
      <AuthTitle
        title="Let’s start with you"
        subtitle="Create the identity information attached to your Egety profile."
      />
      <Field
        label="First name"
        value={draft.firstName}
        onChangeText={(value) => update('firstName', value)}
        placeholder="First name"
        autoCapitalize="words"
      />
      <Field
        label="Last name"
        value={draft.lastName}
        onChangeText={(value) => update('lastName', value)}
        placeholder="Last name"
        autoCapitalize="words"
      />
      <Field
        label="Sponsor / invitation ID"
        value={draft.sponsor}
        onChangeText={(value) => update('sponsor', value)}
        placeholder="Optional sponsor"
      />
      <Text style={s.sectionLabel}>Official gender</Text>
      <View style={s.choiceRow}>
        <Choice
          label="Male"
          icon="gender-male"
          selected={draft.gender === 'male'}
          onPress={() => update('gender', 'male')}
        />
        <Choice
          label="Female"
          icon="gender-female"
          selected={draft.gender === 'female'}
          onPress={() => update('gender', 'female')}
        />
      </View>
    </>
  );
}

const ruleLabel: Record<string, string> = {
  capitals: '2 capital letters',
  lowercase: '2 lowercase letters',
  numbers: '2 numbers',
  special: '2 special characters',
  length: 'Minimum 10 characters',
  matches: 'Passwords match',
};
const s = StyleSheet.create({
  choiceRow: { flexDirection: 'row', gap: 10 },
  sectionLabel: { ...typography.label, color: colors.white },
  helper: { ...typography.text, color: colors.grey },
  message: {
    ...typography.label,
    color: colors.red,
    padding: 10,
    borderLeftWidth: 2,
    borderColor: colors.red,
  },
  generate: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  generateText: { ...typography.label, color: colors.blueBright },
  rules: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  rule: { width: '47%', flexDirection: 'row', gap: 6, alignItems: 'center' },
  ruleText: { ...typography.label, color: colors.grey },
  rulePassed: { color: colors.white },
  terms: { flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  termsText: { ...typography.label, color: colors.grey, flex: 1 },
  successIcon: { alignItems: 'center' },
  eidBox: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.blueBright,
    paddingVertical: 20,
    gap: 6,
    alignItems: 'center',
  },
  eidLabel: { ...typography.label, color: colors.grey, letterSpacing: 1 },
  eid: { fontFamily: 'Inter_700Bold', fontSize: 24, color: colors.blueBright },
});
