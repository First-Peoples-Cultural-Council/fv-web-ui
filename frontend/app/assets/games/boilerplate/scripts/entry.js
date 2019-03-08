import Game from '../';

document.addEventListener("DOMContentLoaded", function(event) {
    const gameContainer = document.getElementById('game');
    Game.init(gameContainer,{});
});