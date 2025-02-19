import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from "react-native";
import RNFS from "react-native-fs";
import { PermissionsAndroid, Platform } from "react-native";
import { parse } from "papaparse";
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

      const animeRows = parse(anime, { header: true }).data;
      const movieRows = parse(movie, { header: true }).data;

      console.log("🔍 First few rows from Anime CSV:", animeRows.slice(0, 5));
      console.log("🔍 First few rows from Anime CSV:", movieRows.slice(0, 5));
      const filteredAnimes = animeRows
        .filter(row => row.title?.toLowerCase().includes(input.toLowerCase()))
        .map(row => ({
          title: row.title_english || row.title, // Use English title if available
          rating: row.score || "N/A", // Rating
          genres: row.genres || "Unknown", // Genres
          description: row.synopsis || "No description available", // Description
        }));

      // ✅ Filter and extract movie results
      const filteredMovies = movieRows
        .filter(row => row.title?.toLowerCase().includes(input.toLowerCase()))
        .map(row => ({
          title: row.title, // Movie title
          rating: row.vote_average || "N/A", // Rating
          popularity: row.popularity || "Unknown", // Popularity score
          description: row.overview || "No description available", // Description
        }));
      //const filteredanimes = animerow.filter(item => item.toLowerCase().includes(input.toLowerCase()));
      //const filteredMovies = movieRow.filter(item => item.toLowerCase().includes(input.toLowerCase()));

      setMovies(filteredMovies);
      setAnimes(filteredAnimes);

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

      <Text style={styles.subtitle}>🎬 Recommendation's:</Text>
      <FlatList
        data={movies}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemTitle}>🎬 {item.title}</Text>
            <Text style={styles.itemRating}>⭐ Rating: {item.rating}</Text>
            <Text style={styles.itemGenre}>🎭 popularity: {item.popularity}</Text>

          </View>
        )}
      />

      <Text style={styles.subtitle}>🎭 Recommendation's:</Text>
      <FlatList
        data={animes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemTitle}>📺 {item.title}</Text>
            <Text style={styles.itemRating}>⭐ Rating: {item.rating}</Text>
            <Text style={styles.itemGenre}>🎭 Genre: {item.genres}</Text>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f8f8", flex: 1 },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 10, borderRadius: 5, backgroundColor: "#fff" },
  subtitle: { fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 10, color: "#333" },
  resultItem: { fontSize: 16, padding: 5, borderBottomWidth: 1, borderColor: "#ddd" },
  card: {
    backgroundColor: "#fff",
    padding: 12, marginVertical: 5,
    borderRadius: 10, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 4, elevation: 3
  },

  itemTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  itemRating: { fontSize: 16, fontWeight: "bold", color: "#ff9900", marginTop: 3 },
  itemGenre: { fontSize: 14, color: "#666", fontStyle: "italic", marginTop: 3 },
  itemDescription: { fontSize: 16, color: "#444", marginTop: 5 },
});


