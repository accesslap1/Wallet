import { colors } from '@/src/design/tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blueBright,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          height: 70,
          paddingTop: 7,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, paddingBottom: 7 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="wallet-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="layers-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="swap-vertical" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
