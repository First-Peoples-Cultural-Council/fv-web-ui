import configManager from './config';

class GameTitle {

    init(data)
    {
        this.config = configManager.getConfig();
        this.data = data;
    }

    create()
    {
        this.createBackground();
        this.createPuzzleImage();
        this.createCorners();
        this.createTitle();

        const easy = this.createButton('easy');
        const medium = this.createButton('medium');
        const hard = this.createButton('hard');

        easy.x   = this.game.width / 2;
        medium.x = this.game.width / 2;
        hard.x   = this.game.width / 2;
        easy.y   = 170;
        medium.y = 300;
        hard.y   = 420;
    }

    createTitle()
    {
        var title = this.add.text(0,0, 'Choose a difficulty');
        title.anchor.set(0, 0);
        title.font = 'Arial';
        title.fontSize = 35;
        title.fill = '#FFFFFF';
        title.stroke = '#000000';
        title.strokeThickness = 2;
        title.anchor.x = 0.5;
        title.anchor.y = 0.5;
        title.x = this.game.width / 2;
        title.y = 45;
        title.setShadow(1, 1, '#000000', 1);
        title.resolution = 2;        
    }
    
    createPuzzleImage()
    {
        const width = 680;
        const height = 425;

        const image = this.add.image(0,0,this.data.img);        
        image.width = width;
        image.height = height;

        const border = this.add.graphics(0, 0);
        border.lineStyle(4, 0xFFFFFF, 1);
        border.drawRect(0,0, width - 1, height - 2);

        const group = this.add.group();
        group.add(image);
        group.add(border);
        group.x = 60;
        group.y = 89;

    }

    createCorners()
    {
        this.add.sprite(58.5, 86.5, 'corner1a');
        this.add.sprite(693.5, 86.5, 'corner1b');
        this.add.sprite(58.5, 465.5, 'corner1c');
        this.add.sprite(693.5, 465.5, 'corner1d');        
    }

    createBackground()
    {
        const sprite = this.add.sprite(0, 0, 'background');
        sprite.scale.setTo(0.5);        
    }

    createButton(name){
        let button = this.add.image(0,0,name);
        button.anchor.setTo(0.5);
        button.inputEnabled = true;
        button.input.useHandCursor = true;
        button.events.onInputDown.add(()=>{
            this.data.difficulty = name;
            this.state.start("Main", true, false, this.data);
        })
        return button;
    }
}

export default GameTitle;
