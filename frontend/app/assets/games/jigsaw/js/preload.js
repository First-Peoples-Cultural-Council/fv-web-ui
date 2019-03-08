import configManager from './config';

class Preload {

    init()
    {
        this.config = configManager.getConfig();

        this.loadingBar = this.game.make.sprite(this.game.world.centerX , 500, "loading");
        this.logo       = this.game.make.sprite(this.game.world.centerX, 250, 'brand');
        this.status     = this.game.make.text(this.game.world.centerX, 450, 'Loading...', {fill: 'black'});

        this.centerObjects([this.logo, this.status, this.loadingBar]);
    }

    centerObjects(objects)
    {
        objects.forEach((obj)=>{
            obj.anchor.setTo(0.5,0.5);
        });
    }

    preload()
    {
        const config = this.config;

        this.game.add.existing(this.logo).scale.setTo(0.5);
        this.game.add.existing(this.loadingBar);
        this.game.add.existing(this.status);
        this.game.load.setPreloadSprite(this.loadingBar);
        
        this.load.script('jigsaw', config.libs.bitmapJigsawScript);
        this.load.image('background', config.images.backgroundImage);
        this.load.image('wellDone', config.images.youWin);
        this.load.image('easy', config.images.easy);
        this.load.image('medium', config.images.medium);
        this.load.image('hard', config.images.hard);

        config.words.forEach((word, index)=>{
            word.pictureKey = `puzzle_${index}_picture`;
            word.audioKey = `puzzle_${index}_sound`;
            this.load.image(word.pictureKey, word.picture);
            this.load.audio(word.audioKey, [word.audio]);
        });

        this.load.images(['corner1a', 'corner1b', 'corner1c', 'corner1d'],[
            config.images.cornerTopLeft,
            config.images.cornerTopRight,
            config.images.cornerBottomLeft,
            config.images.cornerBottomRight
        ]);

        this.load.image('arrow', config.images.arrow);
    }

    fade (nextState)
    {
        this.nextState = nextState;

        const fadeBackground = this.game.add.graphics(0, 0);
        fadeBackground.beginFill(0xFFFFFF, 1);
        fadeBackground.drawRect(0, 0, this.game.width, this.game.height);
        fadeBackground.alpha = 0;
        fadeBackground.endFill();

        const backgroundTween = this.game.add.tween(fadeBackground);
        backgroundTween.to({ alpha: 1 }, 1000, null);
        backgroundTween.onComplete.add(this.changeState, this);
        backgroundTween.start();
    }

    changeState()
    {
        this.game.state.start(this.nextState);
        this.fadeOut();
    }

    fadeOut()
    {
        var fadeBackground = this.game.add.graphics(0, 0);
        fadeBackground.beginFill(0xFFFFFF, 1);
        fadeBackground.drawRect(0, 0, this.game.width, this.game.height);
        fadeBackground.alpha = 1;
        fadeBackground.endFill();

        const backgroundTween = this.game.add.tween(fadeBackground);
        backgroundTween.to({ alpha: 0 }, 1000, null);
        backgroundTween.start();
    }


    create(){
        this.fade("GameTitle");
    }
}

export default Preload;
