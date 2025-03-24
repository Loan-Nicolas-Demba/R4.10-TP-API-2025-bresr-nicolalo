import { fetchPopularGames } from './api.js';

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

async function displayPopularGames() {
    games = await fetchPopularGames(); // Récupère tous les jeux
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
        gameCard.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail">
            <h3 class="game-title">${game.title}</h3>
            <p class="game-genre">${game.genre}</p>
        `;
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
