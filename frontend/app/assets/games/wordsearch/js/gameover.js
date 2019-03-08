class GameOver {

    create(){

    }

    restartGame()
    {
        this.game.state.start("GameTitle");
    }
}

export default GameOver;
