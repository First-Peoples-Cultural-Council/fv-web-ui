import JigsawGame from './';

document.addEventListener("DOMContentLoaded", function(event) { 
    const gameContainer = document.getElementById('game');
    JigsawGame.init(gameContainer,{});
});