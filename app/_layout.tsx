import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { WalletProvider } from '@/src/state/wallet-context';
export default function RootLayout() {
  return (
    <WalletProvider>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: '#F4F5F0' },
          headerTintColor: '#111B2E',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="account/[id]" options={{ title: 'Account' }} />
        <Stack.Screen name="subaccount/[id]" options={{ title: 'Subaccount' }} />
        <Stack.Screen name="wallet/[id]" options={{ title: 'Wallet' }} />
        <Stack.Screen name="asset/[id]" options={{ title: 'Asset' }} />
        <Stack.Screen name="transaction/[id]" options={{ title: 'Transaction' }} />
      </Stack>
    </WalletProvider>
  );
}
