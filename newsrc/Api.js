import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

export const getMovieRecommendations = async (movie) => {
    try {
        const response = await axios.post(`${BASE_URL}/recommend/movies`, { movie });
        return response.data.recommendations;
    } catch (error) {
        console.error("Error fetching movie recommendations:", error);
        return ["Error fetching recommendations"];
    }
};
export const getAnimeRecommendations = async (anime) => {
    try {
        const response = await axios.post(`${BASE_URL}/recommend/anime`, { anime });
        return response.data.recommendations;
    } catch (error) {
        console.error("Error fetching anime recommendations:", error);
        return ["Error fetching recommendations"];
    }
};