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



// Fonction pour faire la requête à l'API avec les filtres
export async function fetchFilteredGames(platform = null, genre = null) {
    try {
        // Construire l'URL de base avec le tri par popularité
        let url = `${API_URL}/games?`;

        // Ajouter le filtre de plateforme si spécifié
        if (platform) {
            url += `&platform=${encodeURIComponent(platform)}`;
        }

        // Ajouter le filtre de genre si spécifié
        if (genre) {
            url += `&category=${encodeURIComponent(genre)}`;
        }


        console.log("URL de la requête :", url); // Affichez l'URL pour vérifier

        const response = await fetch(`${PROXY_URL}${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error("Erreur API");
        const data = await response.json(); 
        return JSON.parse(data.contents);
    } catch (error) {
        console.error("Erreur API:", error);
        return [];
    }
    
}