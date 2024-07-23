import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import { supabase } from "@/config/supabase";
import { useRouter } from "expo-router";
import ToBack from "@/components/ToBack";
import { AntDesign } from '@expo/vector-icons';

const PlayList = () => {
  const router = useRouter();
  const [music, setMusic] = useState([]);
  const [filteredMusic, setFilteredMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMusic = async () => {
      setLoading(true);
      try {
        const { data: files, error: listError } = await supabase.storage
          .from("bluemusic")
          .list("");
        if (listError) throw listError;

        const musicData = await Promise.all(
          files.map(async (file) => {
            const { data, error } = await supabase.storage
              .from("bluemusic")
              .getPublicUrl(file.name);
            if (error) {
              console.error("Error al obtener URL pública:", error);
              return null;
            }
            return {
              id: file.id,
              title: file.name,
              uri: data.publicUrl || "",
            };
          })
        );

        setMusic(musicData.filter((item) => item !== null));
        setFilteredMusic(musicData.filter((item) => item !== null));
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      setFilteredMusic(
        music.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredMusic(music);
    }
  };

  const handleMusic = (song) => {
    router.push({
      pathname: "/Home",
      params: { song: JSON.stringify(song) },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Himnario</Text>
      <View style={styles.containerSearch}>
        <ToBack />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredMusic}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleMusic(item)}
          >
            <Text style={styles.text}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  containerSearch:{
    flexDirection:"row",
    justifyContent:'space-between'
  },
  searchInput: {
    fontSize:20,
    height: 45,
    width:300,
    borderColor: "#ccc",
    borderRadius:20,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor:'#EFEFEF',
    paddingLeft:20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  text: {
    fontSize: 18,
  },
});

export default PlayList;
