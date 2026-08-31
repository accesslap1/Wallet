import { Tabs } from 'expo-router';
import { Text } from 'react-native';
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2C5D4B',
        tabBarInactiveTintColor: '#687387',
        tabBarStyle: { height: 64, paddingTop: 6, backgroundColor: '#FFFFFF', borderTopColor: '#DDE1D8' },
        tabBarLabelStyle: { fontWeight: '700', paddingBottom: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 19 }}>⌂</Text> }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>▤</Text>,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>↕</Text>,
        }}
      />
    </Tabs>
  );
}
