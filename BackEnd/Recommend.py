import pandas as pd

movies_df = pd.read_csv("data/TMDB 10000 Movies Dataset.csv")
def get_movie_recommendations(movie_title):
    
    if movie_title not in movies_df["title"].values:
        return ["Movie not found in database"]
    
    genre = movies_df[movies_df["title"] == movie_title]["genres"].values[0]
    recommendations = movies_df[movies_df["genres"] == genre]["title"].tolist()

    recommendations.remove(movie_title)
    return recommendations[:10]