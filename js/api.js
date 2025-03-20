const API_URL = "https://www.freetogame.com/api/games";

export async function fetchGames(searchTerm) {
    try {
        const response = await fetch(`${API_URL}?platform=pc`);
        if (!response.ok) throw new Error("Erreur API");

        const games = await response.json();
        return games.filter(game => game.title.toLowerCase().includes(searchTerm.toLowerCase()));
    } catch (error) {
        console.error("Erreur API:", error);
        return [];
    }
}




// recherche juste par catégorie

// recherche juste par plateforme

// recherche par aggrégation de catégories : TAG

// jeux par id -> BIEN + DINFO