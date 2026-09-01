import {
  AuthBrand,
  AuthFooter,
  AuthScreen,
  PrimaryButton,
  SecondaryButton,
} from '@/src/features/auth/auth-ui';
import { useAuth } from '@/src/features/auth/auth-context';
import { colors, typography } from '@/src/design/tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Welcome() {
  const { session } = useAuth();
  if (session) return <Redirect href="/home" />;
  return (
    <AuthScreen>
      <AuthBrand />
      <View style={s.hero}>
        <Text style={s.eyebrow}>SECURE DIGITAL WALLET</Text>
        <Text style={s.title}>Welcome to Egety</Text>
        <Text style={s.copy}>Your identity, access and wallet—protected in one place.</Text>
      </View>
      <View style={s.securityMark}>
        <MaterialCommunityIcons name="shield-check-outline" size={48} color={colors.blueBright} />
        <Text style={s.securityText}>Layered verification protects every sign in.</Text>
      </View>
      <View style={s.actions}>
        <PrimaryButton label="Sign in" onPress={() => router.push('/signin')} />
        <SecondaryButton label="Sign up" onPress={() => router.push('/signup')} />
      </View>
      <AuthFooter />
    </AuthScreen>
  );
}

const s = StyleSheet.create({
  hero: { gap: 8, paddingTop: 30 },
  eyebrow: { ...typography.label, color: colors.blueBright, letterSpacing: 1.5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 32, lineHeight: 39, color: colors.white },
  copy: { ...typography.text, color: colors.grey },
  securityMark: {
    borderLeftWidth: 2,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  securityText: { ...typography.text, color: colors.grey },
  actions: { gap: 10, marginTop: 24 },
});
