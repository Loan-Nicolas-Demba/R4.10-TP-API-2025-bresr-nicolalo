import { fetchFilteredGames } from './api.js';


const resultsContainer = document.getElementById('bloc-resultats');
const loadingGif = document.getElementById("loading-gif");
const favsButton = document.querySelector('.display-favs');
const prevButton = document.createElement('button');
const nextButton = document.createElement('button');
let games = []; // Stocke tous les jeux récupérés
let currentPage = 1;
const gamesPerPage = 25; // Nombre de jeux par page
let showingFavorites = false;

// Création des boutons de navigation
prevButton.innerText = "Précédent";
nextButton.innerText = "Suivant";

prevButton.addEventListener('click', () => changePage(currentPage - 1));
nextButton.addEventListener('click', () => changePage(currentPage + 1));

const fieldsets = document.querySelectorAll("fieldset");
// Sélection des boutons radio
const platformRadios = document.querySelectorAll('fieldset:nth-of-type(2) input[type="radio"]');
const genreRadios = document.querySelectorAll('fieldset:nth-of-type(3) input[type="radio"]');
const tagCheckboxes = document.querySelectorAll('fieldset:nth-of-type(4) input[type="checkbox"]');

function getSelectedTags() {
    return Array.from(document.querySelectorAll('fieldset:nth-of-type(4) input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.id);
}

// Fonctions pour récupérer les valeurs sélectionnées
function getSelectedPlatform() {
    const selectedPlatform = document.querySelector('fieldset:nth-of-type(2) input[type="radio"]:checked').id;
    return selectedPlatform === "deux" ? null : selectedPlatform.toLowerCase(); // "deux" signifie aucune plateforme spécifique
}

function getSelectedGenre() {
    const selectedGenre = document.querySelector('fieldset:nth-of-type(3) input[type="radio"]:checked').id;
    return selectedGenre === "tous" ? null : selectedGenre.toLowerCase(); // "tous" signifie aucun genre spécifique
}

// Ajouter des listeners sur les boutons radio de plateforme
platformRadios.forEach(radio => {
    radio.addEventListener('change', displayPopularGames);
});

// Ajouter des listeners sur les boutons radio de genre
genreRadios.forEach(radio => {
    radio.addEventListener('change', displayPopularGames);
});

// Ajouter des listeners sur les checkboxes de tags

tagCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', displayPopularGames);
});


// Ajout d'un listener sur le select
const selectElement = document.querySelector('.sorted-by');

// Écouteur d'événements pour détecter le changement de sélection
selectElement.addEventListener('change', displayPopularGames);

// Fonction pour récupérer la valeur sélectionnée
function getSelectedSort() {
    return selectElement.value;
}






async function displayPopularGames() {

    const selectedPlatform = getSelectedPlatform();
    const selectedGenre = getSelectedGenre();
    const selectedSort = getSelectedSort();
    const selectedTags = getSelectedTags();

    loadingGif.style.display = "block";
    resultsContainer.innerHTML = ""; 

    try {
        games = await fetchFilteredGames(selectedPlatform, selectedGenre, selectedTags, selectedSort); // Récupère tous les jeux
        showingFavorites = false;
        resultsContainer.innerHTML = ""; 


    } catch (error) {
        console.error("Erreur lors de", error);
    } finally {
        loadingGif.style.display = "none";
    }

    // Ensure games is always an array
    if (!Array.isArray(games)) {
        console.error("Error: games is not an array!", games);
        games = []; // Default to an empty array
    }

    if (games.length === 0) {
        resultsContainer.innerHTML = "<p class='no-games'>Aucun Jeu correspondant à la recherche.</p>";
        return;
    }

    changePage(1); // Affiche la première page

}

function displayFavoriteGames() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || { stores: [] };

    if (favorites.stores.length === 0) {
        resultsContainer.innerHTML = "<p class='no-favorites'>Vous n'avez aucun jeu favori pour le moment.</p>";
        showingFavorites = true; 
        return;
    }

    const favoriteTitles = new Set(favorites.stores);
    const favoriteGames = games.filter(game => favoriteTitles.has(game.title));

    games = favoriteGames;
    showingFavorites = true;
    changePage(1);
}



// Toggle between all games and favorites
favsButton.addEventListener("click", () => {
    if (showingFavorites) {
        // Show fieldsets and re-enable filters when switching back
        fieldsets.forEach(fieldset => {
            fieldset.style.display = "block"; // Show fieldsets
            fieldset.disabled = false; // Enable filters
        });

        displayPopularGames();
        favsButton.innerText = "★ Voir mes favoris";
    } else {
        // Hide and disable fieldsets when viewing favorites
        fieldsets.forEach(fieldset => {
            fieldset.style.display = "none"; // Hide fieldsets
            fieldset.disabled = true; // Disable filters
        });

        displayFavoriteGames();
        favsButton.innerText = "☆ Retour aux jeux";
    }
});



// Toggle favorite status
function toggleFavorite(gameTitle, favButton) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || { stores: [] };
    const index = favorites.stores.indexOf(gameTitle);

    if (index === -1) {
        // Add to favorites
        favorites.stores.push(gameTitle);
        favButton.innerText = "★"; // Set filled star
        favButton.classList.add("favorited");
        console.log(`"${gameTitle}" ajouté aux favoris !`);
    } else {
        // Remove from favorites
        favorites.stores.splice(index, 1);
        favButton.innerText = "☆"; // Set empty star
        favButton.classList.remove("favorited");
        console.log(`"${gameTitle}" supprimé des favoris.`);
    }

    // Update localStorage with the new state
    localStorage.setItem("favorites", JSON.stringify(favorites));
}


// Check if a game is favorited
function isFavorited(gameTitle) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || { stores: [] };
    return favorites.stores.includes(gameTitle);
}

function changePage(page) {
    const totalPages = Math.ceil(games.length / gamesPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    resultsContainer.innerHTML = ''; // Clear the previous results

    const start = (currentPage - 1) * gamesPerPage;
    const end = start + gamesPerPage;
    const gamesToShow = games.slice(start, end);

    gamesToShow.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');

        const link = document.createElement('a');
        link.href = game.game_url;
        link.target = "_blank";

        // Create favorite button
        const favButton = document.createElement("button");
        favButton.classList.add("addToFavBtn");

        // Set initial state for the favorite button
        if (isFavorited(game.title)) {
            favButton.innerText = "★"; // Filled star
            favButton.classList.add("favorited");
        } else {
            favButton.innerText = "☆"; // Empty star
            favButton.classList.remove("favorited");
        }

        favButton.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent link click
            toggleFavorite(game.title, favButton);
        });

        link.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail">
            <h3 class="game-title">${game.title}</h3>
            <p class="game-genre">${game.genre}</p>
        `;

        gameCard.appendChild(link);
        gameCard.appendChild(favButton); // Add favorite button outside <a>

        resultsContainer.appendChild(gameCard);
    ;

    prevButton.style.display = currentPage > 1 ? "inline-block" : "none";
    nextButton.style.display = currentPage < totalPages ? "inline-block" : "none";


    document.addEventListener("DOMContentLoaded", () => {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || { stores: [] };

        document.querySelectorAll(".addToFavBtn").forEach(button => {
            const gameCard = button.closest(".game-card");
            if (!gameCard) return;

            const gameTitle = gameCard.querySelector(".game-title").innerText;

            if (favorites.stores.includes(gameTitle)) {
                button.innerText = "★"; // Set to filled star
                button.classList.add("favorited"); // Apply styling
            }
        });
    });



    
// Ajoute le lien contenant la carte de jeu à la div principale de la carte
gameCard.appendChild(link);

// Ajoute la carte à la section de résultats
resultsContainer.appendChild(gameCard);

    });

    // Crée le conteneur de pagination
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination'); // Ajoute la classe CSS

    // Crée les boutons "Précédent" et "Suivant"
    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(nextButton);

    // Crée un élément pour afficher le numéro de la page
    const pageNumber = document.createElement('span');
    pageNumber.classList.add('page-number');
    pageNumber.innerText = `Page ${currentPage} de ${totalPages}`;

    // Ajoute le numéro de page à la pagination
    paginationContainer.appendChild(pageNumber);

    // Ajoute le conteneur de pagination après les jeux
    resultsContainer.appendChild(paginationContainer);

    // Gère l'affichage des boutons "Précédent" et "Suivant"
    prevButton.style.display = currentPage > 1 ? "inline-block" : "none";
    nextButton.style.display = currentPage < totalPages ? "inline-block" : "none";
}





displayPopularGames();
