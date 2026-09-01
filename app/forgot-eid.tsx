import { colors, radius, typography } from '@/src/design/tokens';
import { mockAuthService } from '@/src/features/auth/mock-auth-service';
import {
  AuthBrand,
  AuthFooter,
  AuthScreen,
  AuthTitle,
  ButtonRow,
  CodeField,
  Field,
  PrimaryButton,
  SecondaryButton,
} from '@/src/features/auth/auth-ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ForgotEid() {
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  const verified = mockAuthService.verifyCode('email', code);
  const submit = () => {
    if (!identifier.trim() || !verified)
      return setMessage('Enter your registered credential and verify the email code.');
    // Never expose whether an identity exists. A real backend would send the email here.
    mockAuthService.hasRecoveryIdentity(identifier);
    setSent(true);
  };
  return (
    <AuthScreen>
      <AuthBrand compact />
      <AuthTitle
        title="Recover your EID"
        subtitle="Enter a username, email or mobile number connected to your Egety identity."
      />
      <Field
        label="Username / Email / Mobile"
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="Enter a connected credential"
      />
      <CodeField
        label="Email verification"
        code={code}
        onChangeText={setCode}
        verified={verified}
        onSend={() => undefined}
      />
      {!!message && <Text style={s.message}>{message}</Text>}
      {sent && (
        <View style={s.notice}>
          <MaterialCommunityIcons name="email-check-outline" size={30} color={colors.blueBright} />
          <Text style={s.noticeTitle}>Request received</Text>
          <Text style={s.noticeText}>
            If an email is linked to these credentials and registered in Egety, the EID has been sent to it.
          </Text>
        </View>
      )}
      <ButtonRow>
        <SecondaryButton label="Back" onPress={() => router.back()} />
        <PrimaryButton label="Send EID" onPress={submit} />
      </ButtonRow>
      <AuthFooter />
    </AuthScreen>
  );
}
const s = StyleSheet.create({
  message: { ...typography.label, color: colors.red },
  notice: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.medium,
    backgroundColor: colors.background,
    padding: 18,
    alignItems: 'center',
    gap: 8,
  },
  noticeTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.white },
  noticeText: { ...typography.text, color: colors.grey, textAlign: 'center' },
});
