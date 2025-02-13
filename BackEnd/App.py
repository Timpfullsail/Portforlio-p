from flask import Flask, request, jsonify
from flask_cors import CORS
import Recommend
import AnimieRecommend
import TMDBapi

app = Flask(__name__)
CORS(app) 

@app.route('/recommend/movies', methods=['POST'])
def recommend_movies():

    data = request.json
    movie_title = data.get("movie")
    recommendations = Recommend.get_movie_recommendations(movie_title)
    return jsonify({"recommendations": recommendations})

@app.route('/recommend/anime', methods=['POST'])
def recommend_anime():

    data = request.json
    anime_title = data.get("anime")
    recommendations = AnimieRecommend.get_anime_recommendations(anime_title)
    return jsonify({"recommendations": recommendations})

@app.route('/movie/netflix', methods=['POST'])
def movie_netflix():

    data = request.json
    movie_title = data.get("movie")
    netflix_link = TMDBapi.fetch_netflix_link(movie_title)
    return jsonify(netflix_link)

if __name__ == '__main__':
    app.run(debug=True)