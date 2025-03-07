import { Stack, Slot } from "expo-router";
import { View, Text } from "react-native";
import { Slot } from "expo-router";

export default function Layout() {

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "yellow" }}>
        <Text style={{ fontSize: 24, textAlign: "center", margin: 20 }}>
          Meu app
        </Text>
        <Slot />
      </View>
    </>
  );
}
