/*------------------------- SCENES ----------------------*/
import Boot         from './scripts/scenes/boot';
import Preload      from './scripts/scenes/preload';
import GameTitle    from './scripts/scenes/gametitle';
import Main         from './scripts/scenes/main';
import GameOver     from './scripts/scenes/gameover';

/*------------------------- CONFIG -----------------------*/
import GameConfig   from './scripts/config';


/**
 * Game initializer
 */
export default {

    /**
     * Game Instance
     */
    gameInstance:null,

    /**
     * Intiialize game with config
     * @param {Element} containerElemement - element to inject canvas into
     * @param {Object} config to extend
     */
    init:function( containerElement, config )
    {
        if(this.gameInstance != null)
        {
            this.destroy();
        }

        GameConfig.setConfig(config);

        //Start Game
        const game = new Phaser.Game(800, 800, Phaser.CANVAS, containerElement);
        game.state.add("Boot", Boot);
        game.state.add("Preload", Preload);
        game.state.add("GameTitle", GameTitle);
        game.state.add("Main", Main);
        game.state.add("GameOver", GameOver);
        game.state.start("Boot");

        this.gameInstance = game;
    },

    /**
     * Destroy
     */
    destroy:function(){
        this.gameInstance.destroy();
        this.gameInstance = null;
    }
}