import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
export default function NotFound() {
  return (
    <View style={s.root}>
      <Text style={s.title}>This page is unavailable.</Text>
      <Link href="/" style={s.link}>
        Return to Wallet Home
      </Link>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: '#F4F5F0' },
  title: { fontSize: 20, fontWeight: '800', color: '#111B2E' },
  link: { fontWeight: '800', color: '#2C5D4B' },
});
