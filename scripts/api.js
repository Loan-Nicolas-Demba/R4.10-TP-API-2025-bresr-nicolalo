const API_URL = "https://www.freetogame.com/api";
const PROXY_URL = "https://api.allorigins.win/get?url=";

// Fonction pour récupérer les jeux populaires
export async function fetchPopularGames() {
    try {
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(`${API_URL}/games?sort-by=popularity`)}`);
        if (!response.ok) throw new Error("Erreur API");
        const data = await response.json(); 
        return JSON.parse(data.contents);
    } catch (error) {
        console.error("Erreur API:", error);
        return [];
    }
}

// Fonction pour récupérer les jeux avec un terme de recherche
export async function fetchGames(searchTerm) {
    try {
        const response = await fetch(`${API_URL}/games?platform=pc`);
        if (!response.ok) throw new Error("Erreur API");

        const games = await response.json();
        return games.filter(game => game.title.toLowerCase().includes(searchTerm.toLowerCase()));
    } catch (error) {
        console.error("Erreur API:", error);
        return [];
    }
}

// Fonction pour récupérer les jeux par catégorie
export async function fetchGamesByCategory(category) {
    try {
        const response = await fetch(`${API_URL}/games?category=${category}`);
        if (!response.ok) throw new Error("Erreur API");

        return await response.json();
    } catch (error) {
        console.error("Erreur API:", error);
        return [];
    }
}

// Fonction pour récupérer les jeux par plateforme
export async function fetchGamesByPlatform(platform) {
    try {
        const response = await fetch(`${API_URL}/games?platform=${platform}`);
        if (!response.ok) throw new Error("Erreur API");

        return await response.json();
    } catch (error) {
        console.error("Erreur API:", error);
        return [];
    }
}

// Fonction pour récupérer les jeux par tags
export async function fetchGamesByTags(tags, platform = 'pc', sort = 'relevance') {
    try {
        const response = await fetch(`${API_URL}/filter?tag=${tags}&platform=${platform}&sort-by=${sort}`);
        if (!response.ok) throw new Error("Erreur API");

        return await response.json();
    } catch (error) {
        console.error("Erreur API:", error);
        return [];
    }
}

// Fonction pour récupérer les détails d'un jeu par son ID
export async function fetchGameById(gameId) {
    try {
        const response = await fetch(`${API_URL}/game?id=${gameId}`);
        if (!response.ok) throw new Error("Erreur API");

        return await response.json();
    } catch (error) {
        console.error("Erreur API:", error);
        return null;
    }
}