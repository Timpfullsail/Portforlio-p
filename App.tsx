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
  
          const rows = contents.split("\n").map(row => row.trim());
          const filteredResults = rows.filter(item => item.toLowerCase().includes(input.toLowerCase()));
  
          setMovies(filteredResults);
          setAnimes(filteredResults);

      } catch (error) {
          console.error("❌ Error reading file:", error);
          Alert.alert("Error", `Could not read ${fileName}. Try rebuilding the app.`);
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

      <Text style={styles.subtitle}>🎭 Recommended Anime:</Text>
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
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 10, borderRadius: 5 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  resultItem: { fontSize: 16, padding: 5, borderBottomWidth: 1, borderColor: "#ddd" },
});


