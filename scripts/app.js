import { fetchPopularGames } from './api.js';

async function displayPopularGames() {
    const games = await fetchPopularGames();
    const resultsContainer = document.getElementById('bloc-resultats'); // CORRECTION !

    resultsContainer.innerHTML = ''; // On vide l'ancien contenu

    games.slice(0, 10).forEach(game => { // On affiche les 10 jeux les plus populaires
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');

        gameCard.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail">
            <h3 class="game-title">${game.title}</h3>
            <p class="game-genre">${game.genre}</p>
        `;

        resultsContainer.appendChild(gameCard);
    });
}

displayPopularGames();
