import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Link } from "expo-router";

const OptionsNavi = () => {
  return (
    <View style={styles.container}>
      <Link href="BluetoothConfig" asChild>
        <TouchableOpacity>
          <Feather name="bluetooth" size={40} color="black" />
        </TouchableOpacity>
      </Link>
      <Link href='PlayList' asChild>
        <TouchableOpacity>
          <MaterialIcons name="menu-book" size={40} color="black" />
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default OptionsNavi;

const styles = StyleSheet.create({
  container: {
    margin: 35,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
