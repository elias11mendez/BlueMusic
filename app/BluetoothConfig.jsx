import { StyleSheet, Text, View } from "react-native";
import React from "react";
import * as Network from "expo-network";
import OptionsNavi from "@/components/OptionsNavi";
import ToBack from "@/components/ToBack";

const BluetoothConfig = () => {
  return (
    <View>
      <ToBack />
      <Text>BluetoothConfig</Text>
    </View>
  );
};

export default BluetoothConfig;

const styles = StyleSheet.create({});
