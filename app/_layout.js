// app/_layout.js
import { Stack } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="index"
        options={{
          title: "Leitor QR",
          headerShown: false
        }}
      />
      <Stack.Screen name="historico" 
        options={{
          title: "Histórico",
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="#fff"
                style={{ marginLeft: 15 }}
              />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
