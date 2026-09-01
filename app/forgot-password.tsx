import { colors, typography } from '@/src/design/tokens';
import {
  MOCK_CODES,
  VerificationChannel,
  isStrongPassword,
  passwordChecks,
} from '@/src/features/auth/auth-models';
import { mockAuthService } from '@/src/features/auth/mock-auth-service';
import {
  AuthBrand,
  AuthFooter,
  AuthScreen,
  AuthTitle,
  ButtonRow,
  CodeField,
  DevelopmentCode,
  Field,
  PrimaryButton,
  SecondaryButton,
} from '@/src/features/auth/auth-ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [codes, setCodes] = useState<Record<VerificationChannel, string>>({
    email: '',
    sms: '',
    authenticator: '',
  });
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const checks = passwordChecks(password, confirmation);
  const verified = (channel: VerificationChannel) => mockAuthService.verifyCode(channel, codes[channel]);
  const change = () => {
    if (!identifier.trim() || !verified('email') || !verified('sms') || !verified('authenticator'))
      return setMessage('Enter your identity and complete all development verification methods.');
    if (!isStrongPassword(password, confirmation))
      return setMessage('The new password must meet every requirement.');
    // The same neutral response is shown whether or not an identity exists.
    mockAuthService.resetPassword(identifier, password);
    setSuccess(true);
  };
  if (success)
    return (
      <AuthScreen>
        <AuthBrand />
        <View style={s.success}>
          <MaterialCommunityIcons name="check-decagram-outline" size={72} color={colors.blueBright} />
          <AuthTitle
            title="Password changed successfully"
            subtitle="If the provided identity matched a development profile, its password is now updated."
          />
        </View>
        <PrimaryButton label="Return to sign in" onPress={() => router.replace('/signin')} />
        <AuthFooter />
      </AuthScreen>
    );
  return (
    <AuthScreen>
      <AuthBrand compact />
      <AuthTitle
        title="Forgot password"
        subtitle="Verify the identity connected to your account, then create a replacement password."
      />
      <Field
        label="Email address or EID"
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="Enter email or EID"
      />
      {(['email', 'sms', 'authenticator'] as VerificationChannel[]).map((channel) => (
        <View key={channel} style={s.group}>
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
        </View>
      ))}
      <Field
        label="New password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="Create new password"
      />
      <Field
        label="Confirm password"
        secureTextEntry
        value={confirmation}
        onChangeText={setConfirmation}
        placeholder="Repeat new password"
      />
      <View style={s.rules}>
        {Object.entries(checks).map(([key, passed]) => (
          <Text key={key} style={[s.rule, passed && s.rulePassed]}>
            {passed ? '✓' : '○'} {labels[key]}
          </Text>
        ))}
      </View>
      {!!message && <Text style={s.message}>{message}</Text>}
      <ButtonRow>
        <SecondaryButton label="Back" onPress={() => router.back()} />
        <PrimaryButton label="Change password" onPress={change} />
      </ButtonRow>
      <AuthFooter />
    </AuthScreen>
  );
}
const labels: Record<string, string> = {
  capitals: '2 capitals',
  lowercase: '2 lowercase',
  numbers: '2 numbers',
  special: '2 special',
  length: '10 characters',
  matches: 'Passwords match',
};
const s = StyleSheet.create({
  group: { gap: 8, paddingBottom: 14, borderBottomWidth: 1, borderColor: colors.divider },
  rules: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  rule: { width: '47%', ...typography.label, color: colors.grey },
  rulePassed: { color: colors.blueBright },
  message: { ...typography.label, color: colors.red },
  success: { gap: 18, alignItems: 'center' },
});
