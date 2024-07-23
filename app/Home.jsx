import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import OptionsNavi from "@/components/OptionsNavi";
import { useGlobalSearchParams } from "expo-router";
import Slider from "@react-native-community/slider";
import { Feather } from "@expo/vector-icons";

const Home = () => {
  const { song } = useGlobalSearchParams();
  const music = song ? JSON.parse(song) : null;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef(null);
  const positionUpdateInterval = useRef(null);

  useEffect(() => {
    const loadAndPlaySound = async () => {
      if (music) {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: music.uri },
          { shouldPlay: true }
        );

        soundRef.current = sound;
        setSound(sound);

        sound.setOnPlaybackStatusUpdate((status) => {
          setIsPlaying(status.isPlaying);
          setPosition(status.positionMillis);
          setDuration(status.durationMillis);
        });

        await sound.playAsync();
      }
    };

    loadAndPlaySound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      if (positionUpdateInterval.current) {
        clearInterval(positionUpdateInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (soundRef.current && isPlaying) {
      positionUpdateInterval.current = setInterval(async () => {
        const status = await soundRef.current.getStatusAsync();
        if (status.isPlaying) {
          setPosition(status.positionMillis);
        }
      }, 1000); // Update every second
    } else if (positionUpdateInterval.current) {
      clearInterval(positionUpdateInterval.current);
    }

    return () => {
      if (positionUpdateInterval.current) {
        clearInterval(positionUpdateInterval.current);
      }
    };
  }, [isPlaying]);

  const playPauseSound = async () => {
    try {
      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await soundRef.current.pauseAsync();
            setIsPlaying(false);
          } else {
            await soundRef.current.playAsync();
            setIsPlaying(true);
          }
        }
      } else if (music) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: music.uri },
          { shouldPlay: true }
        );

        soundRef.current = sound;
        setSound(sound);

        sound.setOnPlaybackStatusUpdate((status) => {
          setIsPlaying(status.isPlaying);
          setPosition(status.positionMillis);
          setDuration(status.durationMillis);
        });

        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  };

  const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      setIsPlaying(false);
      setPosition(0);
    }
  };

  const getFormattedTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  return (
    <View style={styles.container}>
      <OptionsNavi />
      <View style={styles.boxContainer}>
        <Text style={styles.title}>
          {music ? music.title : "Selecciona un Himno"}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={async (value) => {
            if (soundRef.current) {
              await soundRef.current.setPositionAsync(value);
              setPosition(value);
              const status = await soundRef.current.getStatusAsync();
              if (!status.isPlaying) {
                await soundRef.current.playAsync();
                setIsPlaying(true);
              }
            }
          }}
          minimumTrackTintColor="*0084FF"
          maximumTrackTintColor="black"
          thumbTintColor="blue"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{getFormattedTime(position)}</Text>
          <Text style={styles.timeText}>{getFormattedTime(duration)}</Text>
        </View>
        <View style={styles.containerController}>
          <TouchableOpacity
            style={styles.controllerPlay}
            onPress={playPauseSound}
          >
            <Feather
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={40}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={stopSound} style={styles.controllerNext}>
          <Feather name="stop-circle" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
    justifyContent: "center",
    alignItems: "center",
  },
  imgReact: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
  title: {
    marginTop: 50,
    fontSize: 20,
    fontWeight: "bold",
  },
  containerController: {
    width: 324,
    height: 80,
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "gray",
    flexDirection: 'column',
    marginTop: 50,

  },
  controllerNext: {
    width: 60,
    height: 60,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A9E5FF",
    marginTop:30,

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
    
    marginTop: 100,
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

export default Home;
