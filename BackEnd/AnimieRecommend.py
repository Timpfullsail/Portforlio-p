import pandas as pd
anime_df = pd.read_csv("data/anime.csv")
def get_anime_recommendations(anime_title):
    if anime_title not in anime_df["title"].values:
        return ["Anime not found in database"]

    genre = anime_df[anime_df["title"] == anime_title]["genre"].values[0]
    recommendations = anime_df[anime_df["genre"] == genre]["title"].tolist()

    recommendations.remove(anime_title)
    return recommendations[:10]