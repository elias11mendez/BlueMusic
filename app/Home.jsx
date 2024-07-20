import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image
} from "react-native";
import { Audio } from "expo-av";
import { Feather } from "@expo/vector-icons";
import OptionsNavi from "@/components/OptionsNavi";
import Slider from "@react-native-community/slider";
const Home = () => {
  const music = [
    {
      id: "1",
      title: "Ramenez La Coupe À La Maison",
      uri: require("../assets/music/example.mp3"),
    },
    {
      id: "2",
      title: "Ace of Base - All That She Wants",
      uri: require("../assets/music/example2.m4a"),
    },
  ];

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0); // Track the current song index
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  async function playSound(uri) {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound, status } = await Audio.Sound.createAsync(
      uri,
      {},
      onPlaybackStatusUpdate
    );
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);
    setPosition(0);
    setDuration(status.durationMillis);
  }

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      if (status.didJustFinish) {
        playNext();
      }
    }
  };

  async function togglePlayPause() {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      playSound(music[currentSongIndex].uri);
    }
  }

  async function playNext() {
    let nextIndex = (currentSongIndex + 1) % music.length;
    setCurrentSongIndex(nextIndex);
    await playSound(music[nextIndex].uri);
  }

  async function playPrevious() {
    let prevIndex = (currentSongIndex - 1 + music.length) % music.length;
    setCurrentSongIndex(prevIndex);
    await playSound(music[prevIndex].uri);
  }

  const onSliderValueChange = async (value) => {
    if (sound) {
      const newPosition = value * duration;
      await sound.setPositionAsync(newPosition);
      setPosition(newPosition);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (sound && isPlaying) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sound, isPlaying]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <OptionsNavi />
      <View style={styles.boxContainer}>
        <View style={styles.boxImage}>
            <Image styles={styles.imgReact} source={require('../assets/images/react.png')}></Image>
        </View>

        <Text style={styles.title}>{music[currentSongIndex].title}</Text>

        <Slider
          style={styles.slider}
          value={position / duration || 0}
          onValueChange={onSliderValueChange}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#0084FF"
          maximumTrackTintColor="black"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.containerController}>
          <TouchableOpacity
            style={styles.controllerNext}
            onPress={playPrevious}
          >
            <Feather name="arrow-left-circle" size={35} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controllerPlay}
            onPress={togglePlayPause}
          >
            <Feather
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={40}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controllerNext} onPress={playNext}>
            <Feather name="arrow-right-circle" size={35} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxContainer: {
    alignItems: "center",
  },
  boxImage: {
    width: 214,
    height: 236,
    borderRadius: 20,
    backgroundColor: "gray",
    justifyContent:"center",
    alignItems:"center"
  },
  imgReact:{
    width:40,
    height:40,
    resizeMode: 'cover',
  },
  title:{
    marginTop:50,
    fontSize:20,
    fontWeight:"bold"
    },
  containerController: {
    width: 324,
    height: 80,
    alignItems: "center",
    justifyContent: "space-between",
   // backgroundColor: "gray",
    flexDirection: "row",
    marginTop:50,

  },
  controllerNext: {
    width: 60,
    height: 60,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A9E5FF",
  },
  controllerPlay: {
    width: 60,
    height: 60,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222222",
  },
  slider: {
    width: "90%",
    height: 40,
    marginTop:100,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },
  timeText: {
    fontSize: 16,
    color: "#000",
  },
});
