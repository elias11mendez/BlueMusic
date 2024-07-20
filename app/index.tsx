import { useEffect } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/Home");

    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);
  return <View>
    <Text>casa</Text>
  </View>;
}
