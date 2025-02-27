import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, Button, FlatList, StyleSheet, Alert,
  TouchableOpacity, LayoutAnimation, UIManager, Platform, Dimensions, ActivityIndicator
} from "react-native";
import RNFS from "react-native-fs";
import { parse } from "papaparse";
import { LineChart } from "react-native-chart-kit";


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const generateRandomViewership = () => {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 5000) + 500);
};

export default function App() {
  const [input, setInput] = useState("");
  const [movies, setMovies] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fileName = "anime.csv";
  const moviefile = "tmdb.csv";

  const updateRecentlyViewed = (searchTerm) => {
    setRecentlyViewed(prev => {
      const updatedList = [searchTerm, ...prev.filter(item => item !== searchTerm)];
      return updatedList.slice(0, 5);
    });
  };
  const handleRecentSearchSelect = (searchTerm) => {
    setInput(searchTerm);
    setShowDropdown(false);
    fetchRecommendations(); 
  };

  const fetchRecommendations = async () => {
    try {
      if (!input.trim()) return;
      setLoading(true);
      updateRecentlyViewed(input);
      console.log(`📄 Attempting to read: ${fileName} and ${moviefile}`);

      const exists = await RNFS.existsAssets(fileName);
      if (!exists) {
        console.error("❌ File does NOT exist in assets!");
        Alert.alert("Error", "Anime file is missing in assets. Make sure it's placed correctly and rebuild.");
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
      console.log("🔍 First few rows from Movie CSV:", movieRows.slice(0, 5));

      const filteredAnimes = animeRows
        .filter(row => row.title?.toLowerCase().includes(input.toLowerCase()))
        .map(row => ({
          id: row.id || row.title,
          title: row.title_english || row.title,
          rating: row.score || "N/A",
          genres: row.genres || "Unknown",
          description: row.synopsis || "No description available",
          viewership: generateRandomViewership(),
        }));

      const filteredMovies = movieRows
        .filter(row => row.title?.toLowerCase().includes(input.toLowerCase()))
        .map(row => ({
          id: row.id || row.title,
          title: row.title,
          rating: row.vote_average || "N/A",
          popularity: row.popularity || "Unknown",
          description: row.overview || "No description available",
          viewership: generateRandomViewership(),
        }));

      setMovies(filteredMovies);
      setAnimes(filteredAnimes);
    } catch (error) {
      console.error("❌ Error reading file:", error);
      Alert.alert("Error", `Could not read ${fileName} or ${moviefile}. Try rebuilding the app.`);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems(prevState => ({
      ...prevState,
      [id]: !prevState[id] || false,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Film Sage</Text>

      <View>
        <TextInput
          style={styles.input}
          placeholder="Enter movie or anime name"
          value={input}
          onChangeText={setInput}
          onFocus={() => setShowDropdown(true)}
        />

        {showDropdown && recentlyViewed.length > 0 && (
          <View style={styles.dropdown}>
            {recentlyViewed.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleRecentSearchSelect(item)}>
                <Text style={styles.dropdownItem}>🔍 {item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Button title="Search" onPress={fetchRecommendations} />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading Recommendations...</Text>
        </View>
      )}
      
      <Text style={styles.subtitle}>🎬 Recommended Movies:</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <View style={styles.card}>
              <Text style={styles.itemTitle}>🎬 {item.title}</Text>
              <Text style={styles.itemRating}>⭐ Rating: {item.rating}</Text>
              <Text style={styles.itemGenre}>🎭 Popularity score: {parseFloat(item.popularity).toFixed(2)}%</Text>

              {expandedItems[item.id] && (
                <>
                  <Text style={styles.itemDescription}>📝 {item.description}</Text>
                  <LineChart
                    data={{
                      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                      datasets: [{ data: item.viewership }]
                    }}
                    width={Dimensions.get("window").width - 45}
                    height={225}
                    yAxisLabel=""
                    yAxisSuffix="view"
                    chartConfig={{
                      backgroundGradientFrom: "#e3f2fd",
                      backgroundGradientTo: "#bbdefb",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                    }}
                    style={{ marginVertical: 8, borderRadius: 16 }}
                  />
                </>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.subtitle}>🎭 Recommended Shows:</Text>
      <FlatList
        data={animes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <View style={styles.card}>
              <Text style={styles.itemTitle}>📺 {item.title}</Text>
              <Text style={styles.itemRating}>⭐ Rating: {item.rating}</Text>
              <Text style={styles.itemGenre}>🎭 Genre: {item.genres}</Text>
              {expandedItems[item.id] && (
                <>
                  <Text style={styles.itemDescription}>📝 {item.description}</Text>
                  <LineChart
                    data={{
                      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                      datasets: [{ data: item.viewership }]
                    }}
                    width={Dimensions.get("window").width - 45}
                    height={225}
                    yAxisLabel=""
                    yAxisSuffix="view"
                    chartConfig={{
                      backgroundGradientFrom: "#e3f2fd",
                      backgroundGradientTo: "#bbdefb",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                    }}
                    style={{ marginVertical: 8, borderRadius: 16 }}
                  />
                </>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
//Visual style's 
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f8f8", flex: 1 },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 10, borderRadius: 5, backgroundColor: "#fff" },
  subtitle: { fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 10, color: "#333" },
  resultItem: { fontSize: 16, padding: 5, borderBottomWidth: 1, borderColor: "#ddd" },
  loadingContainer: { alignItems: "center", marginTop: 20 },
  loadingText: { fontSize: 16, marginTop: 10 },
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


