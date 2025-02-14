import pandas as pd
import json

# Load anime dataset
anime_df = pd.read_csv("anime.csv")

def get_recommendations(query):
    recommendations = anime_df[anime_df["title"].str.contains(query, case=False, na=False)]
    return recommendations["title"].tolist()

user_input = input("Enter anime name: ")
results = get_recommendations(user_input)

# Save to JSON
with open("anime_results.json", "w") as f:
    json.dump(results, f)