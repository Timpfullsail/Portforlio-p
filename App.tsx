import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { getMovieRecommendations, getAnimeRecommendations } from  "./newsrc/API";
import Movie from "./newsrc/Components/Movie";
import Animie from "./newsrc/Components/Animie";
//import MovieRecommendations from "./Components/Movie";
//import AnimeRecommendations from "./API";

export default function App() {
    const [input, setInput] = useState("");
    const [movies, setMovies] = useState([]);
    const [animes, setAnimes] = useState([]);

    const fetchRecommendations = async () => {
        console.log("Fetching recommendations for:", input);
        const movieRecs = await getMovieRecommendations(input);
        const animeRecs = await getAnimeRecommendations(input);

        console.log("Movie recommendations received:", movieRecs);
        console.log("Anime recommendations received:", animeRecs); 

        setMovies(movieRecs);
        setAnimes(animeRecs);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Movie & Anime Recommendation App</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter movie or anime name"
                value={input}
                onChangeText={setInput}
            />
            <Button title="Get Recommendations" onPress={fetchRecommendations} />

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
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 20, fontWeight: "bold" },
    input: { borderWidth: 1, marginVertical: 10, padding: 8 },
    subtitle: { fontSize: 18, marginTop: 20 },
});


