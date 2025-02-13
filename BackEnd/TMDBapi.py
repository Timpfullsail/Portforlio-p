import requests

TMDB_API_KEY = "YOUR_TMDB_API_KEY"

def fetch_netflix_link(movie_title):
    """Fetch Netflix streaming link from TMDb API."""
    base_url = "https://api.themoviedb.org/3/search/movie"
    query_url = f"{base_url}?api_key={TMDB_API_KEY}&query={movie_title.replace(' ', '+')}"

    try:
        response = requests.get(query_url)
        data = response.json()

        if "results" in data and len(data["results"]) > 0:
            movie_id = data["results"][0]["id"]
            providers_url = f"https://api.themoviedb.org/3/movie/{movie_id}/watch/providers?api_key={TMDB_API_KEY}"
            
            provider_response = requests.get(providers_url)
            provider_data = provider_response.json()

            if "results" in provider_data and "US" in provider_data["results"]:
                providers = provider_data["results"]["US"].get("flatrate", [])
                for provider in providers:
                    if provider["provider_name"] == "Netflix":
                        return {
                            "provider_name": "Netflix",
                            "link": f"https://www.netflix.com/search?q={movie_title}"
                        }

        return {"error": "Netflix not available for this movie"}
    except Exception as e:
        return {"error": str(e)}