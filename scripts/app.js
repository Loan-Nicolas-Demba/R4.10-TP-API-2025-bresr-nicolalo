import { fetchPopularGames } from './api.js';
import { fetchFilteredGames } from './api.js';


const resultsContainer = document.getElementById('bloc-resultats');
const prevButton = document.createElement('button');
const nextButton = document.createElement('button');
let games = []; // Stocke tous les jeux récupérés
let currentPage = 1;
const gamesPerPage = 25; // Nombre de jeux par page

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

async function displayPopularGames() {
    const selectedPlatform = getSelectedPlatform();
    const selectedGenre = getSelectedGenre();
    games = await fetchFilteredGames(selectedPlatform, selectedGenre); // Récupère tous les jeux
    changePage(1); // Affiche la première page
}

function changePage(page) {
    const totalPages = Math.ceil(games.length / gamesPerPage);
    if (page < 1 || page > totalPages) return; // Empêche de dépasser les limites des pages

    currentPage = page;
    resultsContainer.innerHTML = ''; // Vide l'ancien contenu

    // Récupère les jeux à afficher pour la page actuelle
    const start = (currentPage - 1) * gamesPerPage;
    const end = start + gamesPerPage;
    const gamesToShow = games.slice(start, end);

    // Crée et affiche les cartes de jeux
    gamesToShow.forEach(game => {
        const gameCard = document.createElement('div');
gameCard.classList.add('game-card');

// Crée un élément <a> qui redirige vers le lien du jeu
const link = document.createElement('a');
link.href = game.game_url; // Assure-toi que game_url contient l'URL du jeu
link.target = "_blank"; // Ouvre le lien dans un nouvel onglet

// Ajoute le contenu de la carte à l'intérieur du lien
link.innerHTML = `
    <img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail">
    <h3 class="game-title">${game.title}</h3>
    <p class="game-genre">${game.genre}</p>
`;

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
