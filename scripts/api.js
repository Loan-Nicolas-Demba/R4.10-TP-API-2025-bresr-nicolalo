const API_URL = "https://www.freetogame.com/api";
const PROXY_URL = "https://api.allorigins.win/get?url=";




// Fonction pour faire la requête à l'API avec les filtres
export async function fetchFilteredGames(platform = null, genre = null, tags = [], sorted = "popularity") {
    try {
        let url = `${API_URL}`;

        if (tags.length > 0) {
            // Construire l'URL de base avec le tri par popularité
            let tagsString = tags.join('.'); // Concaténer les tags avec un point
            url = `${API_URL}/filter?tag=${encodeURIComponent(tagsString)}&sort-by=${sorted}`;
        
            // Ajouter le filtre de plateforme si spécifié
            if (platform) {
                url += `&platform=${encodeURIComponent(platform)}`;
            }
        
            // Ajouter le filtre de genre si spécifié
            if (genre) {
                url += `&category=${encodeURIComponent(genre)}`;
            }
        } else {
            // Construire l'URL de base avec le tri par popularité
            url = `${API_URL}/games?sort-by=${sorted}`;
        
            // Ajouter le filtre de plateforme si spécifié
            if (platform) {
                url += `&platform=${encodeURIComponent(platform)}`;
            }
        
            // Ajouter le filtre de genre si spécifié
            if (genre) {
                url += `&category=${encodeURIComponent(genre)}`;
            }
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