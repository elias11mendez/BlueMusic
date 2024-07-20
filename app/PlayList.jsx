import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
const PlayList = () => {
  return (
    <View style={styles.container}>
      <Text>PlayList</Text>
      <View style={styles.boxContainer}>
        <TextInput style={styles.search}   placeholder="Buscar">

        </TextInput>
      </View>
    </View>
  );
};

export default PlayList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxContainer: {
    alignItems: "center",
  },
  search: {
    width: 324,
    height: 40,
    backgroundColor: "#aaaaaa",
    borderRadius: 20,
    justifyContent:'center',
    alignContent:'space-between',
    paddingLeft:20
  },
});
