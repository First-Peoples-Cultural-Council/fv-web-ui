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
        this.add.existing(this.logo).scale.setTo(0.5);
        this.add.existing(this.loadingBar);
        this.add.existing(this.status);
        this.load.setPreloadSprite(this.loadingBar);

        this.load.image('card', this.config.images.card);
        this.load.image('cardFlipped', this.config.images.cardFlipped);
        this.load.image('background', this.config.images.background);
        this.load.image('title', this.config.images.title);
        this.load.image('time', this.config.images.time);
        this.load.image('wellDone', this.config.images.wellDone);

        this.config.cards.map((card)=>{
            this.load.image(card.image, card.image);
            this.load.audio(card.audio, card.audio);
        });
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
        this.fade("Main");
    }
}

export default Preload;
