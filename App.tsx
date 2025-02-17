import React, { useState, useEffect  } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet,Alert } from "react-native";
//import { getMovieRecommendations, getAnimeRecommendations } from  "./newsrc/API";
//import Movie from "./newsrc/Components/Movie";
//import Animie from "./newsrc/Components/Animie";
import RNFS from "react-native-fs";
import { PermissionsAndroid , Platform  } from "react-native";

export default function App() {
    const [input, setInput] = useState("");
    const [movies, setMovies] = useState([]);
    const [animes, setAnimes] = useState([]);
    const fileName = "anime.csv"; 

    const fetchRecommendations = async () => {
      try {
          console.log(`📄 Attempting to read: ${fileName}`);

          const exists = await RNFS.existsAssets(fileName);
          if (!exists) {
              console.error("❌ File does NOT exist in assets!");
              Alert.alert("Error", "Req.txt is missing in assets. Make sure it's placed correctly and rebuild.");
              return;
          }
          const contents = await RNFS.readFileAssets(fileName, "utf8");
          console.log("✅ File contents:", contents.substring(0, 200));
  
          const rows = contents.split("\n");
          const filteredResults = rows.filter(item => item.toLowerCase().includes(input.toLowerCase()));
  
          // ✅ Update Movies List
          //setMovies(filteredResults);
      } catch (error) {
          console.error("❌ Error reading file:", error);
          Alert.alert("Error", `Could not read ${fileName}. Try rebuilding the app.`);
      }
  };
   return (
    <View style={styles.container}>
      <Text style={styles.title}>                           Film Sage</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter movie or anime name"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Search" onPress={fetchRecommendations} />

      <Text style={styles.subtitle}>🎬 Recommended Movies:</Text>
      <FlatList
        data={movies}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>- {item}</Text>}
      />

      <Text style={styles.subtitle}>🎭 Recommended Anime:</Text>
      <FlatList
        data={animes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>- {item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 20, fontWeight: "bold" },
    input: { borderWidth: 1, marginVertical: 10, padding: 8 },
    subtitle: { fontSize: 18, marginTop: 20 },
});


