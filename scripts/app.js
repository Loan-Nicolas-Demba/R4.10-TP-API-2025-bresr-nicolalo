import { fetchPopularGames } from './api.js';
import { fetchFilteredGames } from './api.js';


const resultsContainer = document.getElementById('bloc-resultats');
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

// Sélection des boutons radio
const platformRadios = document.querySelectorAll('fieldset:first-of-type input[type="radio"]');
const genreRadios = document.querySelectorAll('fieldset:nth-of-type(2) input[type="radio"]');

// Fonctions pour récupérer les valeurs sélectionnées
function getSelectedPlatform() {
    const selectedPlatform = document.querySelector('fieldset:first-of-type input[type="radio"]:checked').id;
    return selectedPlatform === "deux" ? null : selectedPlatform.toLowerCase(); // "deux" signifie aucune plateforme spécifique
}

function getSelectedGenre() {
    const selectedGenre = document.querySelector('fieldset:nth-of-type(2) input[type="radio"]:checked').id;
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
    games = await fetchFilteredGames(selectedPlatform, selectedGenre, selectedSort); // Récupère tous les jeux
    showingFavorites = false;
    changePage(1); // Affiche la première page
}

function displayFavoriteGames() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || { stores: [] };
    const favoriteTitles = new Set(favorites.stores);

    const favoriteGames = games.filter(game => favoriteTitles.has(game.title));
    games = favoriteGames; // Update the displayed list
    showingFavorites = true;
    changePage(1);
}

// Toggle between all games and favorites
favsButton.addEventListener("click", () => {
    if (showingFavorites) {
        displayPopularGames();
        favsButton.innerText = "★ Voir mes favoris";
    } else {
        displayFavoriteGames();
        favsButton.innerText = "☆ Retour aux jeux";
    }
});

function changePage(page) {
    const totalPages = Math.ceil(games.length / gamesPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    resultsContainer.innerHTML = '';

    const start = (currentPage - 1) * gamesPerPage;
    const end = start + gamesPerPage;
    const gamesToShow = games.slice(start, end);

    gamesToShow.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');

        const link = document.createElement('a');
        link.href = game.game_url;
        link.target = "_blank";

        link.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail">
            <h3 class="game-title">${game.title}</h3>
            <p class="game-genre">${game.genre}</p>
            <button class="addToFavBtn">☆</button>
        `;

        gameCard.appendChild(link);
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

   // Event listener for dynamically created "Add to Favorites" buttons
   document.addEventListener("click", (event) => {
    if (event.target.classList.contains("addToFavBtn")) {
        event.preventDefault();
        event.stopPropagation();

        const gameCard = event.target.closest(".game-card"); 
        if (!gameCard) return;

        const gameTitle = gameCard.querySelector(".game-title").innerText; 

        let favorites = JSON.parse(localStorage.getItem("favorites")) || { stores: [] };

        const index = favorites.stores.indexOf(gameTitle);
        if (index === -1) {
            favorites.stores.push(gameTitle);
            event.target.innerText = "★"; // Filled star
            event.target.classList.add("favorited"); // Add styling
            console.log(`"${gameTitle}" ajouté aux favoris !`);
        } else {
            favorites.stores.splice(index, 1);
            event.target.innerText = "☆"; // Empty star
            event.target.classList.remove("favorited"); // Remove styling
            console.log(`"${gameTitle}" supprimé des favoris.`);
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
    }
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
