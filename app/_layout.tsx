import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarHidden: false,
        statusBarColor: "#222222",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="Home" />
      <Stack.Screen name="PlayList"/>
      <Stack.Screen name="BluetoothConfig"/>

    </Stack>
  );
}
