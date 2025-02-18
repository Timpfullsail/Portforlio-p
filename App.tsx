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
    const moviefile = "tmdb.csv"; 

    const fetchRecommendations = async () => {
      try {
          console.log(`📄 Attempting to read: ${fileName} and ${moviefile}`);

          const exists = await RNFS.existsAssets(fileName);
          if (!exists) {
              console.error("❌ File does NOT exist in assets!");
              Alert.alert("Error", "Req.txt is missing in assets. Make sure it's placed correctly and rebuild.");
              return;
          }
          const movieExists = await RNFS.existsAssets(moviefile);
          if (!movieExists) {
              console.error(`❌ ${moviefile} does NOT exist in assets!`);
              Alert.alert("Error", `${moviefile} is missing in assets. Make sure it's placed correctly and rebuild.`);
              return;
          }
          const anime = await RNFS.readFileAssets(fileName, "utf8");
          const movie = await RNFS.readFileAssets(moviefile, "utf8");

          console.log("✅ File contents:", anime.substring(0, 150));
          console.log("✅ Movie file contents:", movie.substring(0, 150));
  
          const row = anime.split("\n").map(row => row.trim());
          const movieRow = movie.split("\n").map(row => row.trim());

          console.log("🔍 First few rows from Anime CSV:", fileName.slice(0, 5));
          console.log("🔍 First few rows from Anime CSV:", moviefile.slice(0, 5));

          const filteredanimes = row.filter(item => item.toLowerCase().includes(input.toLowerCase()));
          const filteredMovies = movieRow.filter(item => item.toLowerCase().includes(input.toLowerCase()));
        
  
          setMovies(filteredMovies);
          setAnimes(filteredanimes);
          
      } catch (error) {
          console.error("❌ Error reading file:", error);
          Alert.alert("Error", `Could not read ${fileName} or ${moviefile}. Try rebuilding the app.`);
      }
  };
   return (
    <View style={styles.container}>
      <Text style={styles.title}>Film Sage</Text>
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

      <Text style={styles.subtitle}>🎭 Recommended Shows:</Text>
      <FlatList
        data={animes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>- {item}</Text>}
        /*(
            <Text style={styles.resultItem}>🎬 {item}</Text>*/
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f8f8", flex: 1 },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 10, borderRadius: 5, backgroundColor: "#fff" },
  subtitle: { fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 10, color: "#333" },
  
  card: { backgroundColor: "#fff", 
    padding: 12, marginVertical: 5, 
    borderRadius: 10, shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, 
    shadowRadius: 4, elevation: 3  },

  itemTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  itemRating: { fontSize: 16, fontWeight: "bold", color: "#ff9900", marginTop: 3 },
  itemGenre: { fontSize: 14, color: "#666", fontStyle: "italic", marginTop: 3 },
  itemDescription: { fontSize: 16, color: "#444", marginTop: 5 },
});


