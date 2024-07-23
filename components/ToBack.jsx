import { StyleSheet, Text, Touchable, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
const ToBack = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
  return (
    <View style={styles.containerBack}>
      <TouchableOpacity onPress={handleBack}>
        <AntDesign name="arrowleft" size={40} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default ToBack;

const styles = StyleSheet.create({
  containerBack: {
    

  },
});
