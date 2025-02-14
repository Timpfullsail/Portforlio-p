import React, { useState, useEffect  } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
//import { getMovieRecommendations, getAnimeRecommendations } from  "./newsrc/API";
//import Movie from "./newsrc/Components/Movie";
//import Animie from "./newsrc/Components/Animie";
import RNFS from "react-native-fs";

export default function App() {
    const [input, setInput] = useState("");
    const [movies, setMovies] = useState([]);
    const [animes, setAnimes] = useState([]);

    const fetchRecommendations = async () => {
        console.log("Fetching recommendations for:", input);
        const animeData = await readCSVFile("anime.csv");
        const movieData = await readCSVFile("TMDB_10000_Movies_Dataset.csv");

        console.log("Anime data:", animeData);
        console.log("Movie data:", movieData);
       
        const filteredAnimes = animeData.filter(item => item.toLowerCase().includes(input.toLowerCase()));
        const filteredMovies = movieData.filter(item => item.toLowerCase().includes(input.toLowerCase()));
        
        setMovies(filteredMovies);
        setAnimes(filteredAnimes);

    };
    
    const readCSVFile = async (fileName) => {
        console.log(RNFS)
        try {
          //const filePath = `${RNFS.MainBundlePath}/${fileName}`;
          const newpath = RNFS.DocumentDirectoryPath;
          const filePath = `${newpath}/${fileName}`;
          //const filePath =`./android/app/src/main/Assets/${fileName}`
          console.log("Reading file from:", filePath);
          const content = await RNFS.readFile(filePath, "utf8");
          const rows = content.split("\n").map(row => row.split(",")[0]); 
          return rows;
        } catch (error) {
          console.error(`Error reading ${fileName}:`, error);
          return [];
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


