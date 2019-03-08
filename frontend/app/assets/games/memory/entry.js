import Memory from './';

document.addEventListener("DOMContentLoaded", function(event) {
    const gameContainer = document.getElementById('game');
    Memory.init(gameContainer,{});
});