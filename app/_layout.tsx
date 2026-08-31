import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { colors } from '@/src/design/tokens';
import { WalletProvider } from '@/src/state/wallet-context';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded, error] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <WalletProvider>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: colors.canvas },
          headerTintColor: colors.white,
          headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
          contentStyle: { backgroundColor: colors.canvas },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="account/[id]" options={{ title: 'Account' }} />
        <Stack.Screen name="subaccount/[id]" options={{ title: 'Sub-account' }} />
        <Stack.Screen name="wallet/[id]" options={{ title: 'Wallet' }} />
        <Stack.Screen name="asset/[id]" options={{ title: 'Asset' }} />
        <Stack.Screen name="transaction/[id]" options={{ title: 'Transaction' }} />
      </Stack>
    </WalletProvider>
  );
}
