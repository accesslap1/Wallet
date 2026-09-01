import {
  AuthBrand,
  AuthFooter,
  AuthScreen,
  PrimaryButton,
  SecondaryButton,
} from '@/src/features/auth/auth-ui';
import { useAuth } from '@/src/features/auth/auth-context';
import { colors, radius, typography } from '@/src/design/tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Welcome() {
  const { session, profiles, setPendingProfile } = useAuth();
  if (session) return <Redirect href="/home" />;
  return (
    <AuthScreen>
      <AuthBrand />
      <View style={s.hero}>
        <Text style={s.title}>Your identity. Your access. Your wallet.</Text>
        <Text style={s.copy}>
          Enter the Egety ecosystem through a protected identity and layered verification.
        </Text>
      </View>
      <View style={s.securityMark}>
        <MaterialCommunityIcons name="shield-key-outline" size={78} color={colors.blueBright} />
        <View style={s.securityCopy}>
          <Text style={s.securityTitle}>Wallet Trust</Text>
          <Text style={s.securityText}>
            Password, verification codes and your registered PIN or pattern protect access.
          </Text>
        </View>
      </View>
      {profiles.length > 0 && (
        <View style={s.profiles}>
          <Text style={s.label}>Profiles on this device</Text>
          {profiles.map((profile) => (
            <SecondaryButton
              key={profile.id}
              label={`${profile.firstName} ${profile.lastName} · ${profile.eid}`}
              onPress={() => {
                setPendingProfile(profile);
                router.push('/signin');
              }}
            />
          ))}
        </View>
      )}
      <View style={s.actions}>
        <PrimaryButton label="Sign in" onPress={() => router.push('/signin')} />
        <SecondaryButton label="Create an Egety profile" onPress={() => router.push('/signup')} />
      </View>
      <AuthFooter />
    </AuthScreen>
  );
}

const s = StyleSheet.create({
  hero: { gap: 8 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 30, lineHeight: 37, color: colors.white },
  copy: { ...typography.text, color: colors.grey },
  securityMark: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  securityCopy: { flex: 1, gap: 6 },
  securityTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.white },
  securityText: { ...typography.text, color: colors.grey },
  profiles: { backgroundColor: colors.background, borderRadius: radius.medium, padding: 14, gap: 10 },
  label: { ...typography.label, color: colors.blueBright, textTransform: 'uppercase', letterSpacing: 1 },
  actions: { gap: 10 },
});
