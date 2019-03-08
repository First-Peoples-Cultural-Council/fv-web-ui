class Main {

    init(data){

        this.states = {
            SELECTING:0,
            PLACING:1,
            DROPPING:2
        };

        this.image = data.img;
        this.lineWidth = 3;
        this.lineStyle = 'rgba(255, 255, 255, 0.7)';

        //  The size of the circles used for hit testing (to see if a piece is put
        //  in the right place). Circle to Circle intersection tests are used.
        //  Each jigsaw piece has a circle in its center, and there is one mapped
        //  to the pointer / mouse.
        //  If you look in the render function you'll see a way to visualise the hit circles.
        //  For very dense jigsaws (with tiny pieces) you'll need to adjust this value.
        this.hitCircleSize = 32;
        this.hitTestCircle = new Phaser.Circle(0, 0, this.hitCircleSize);

        //  A flag that hides all of the other currently un-set jigsaw pieces when you
        //  pick a new one up. Toggle it to see the difference.
        this.hidePiecesOnPickup = true;

        //  The current piece being dragged
        this.current = null;

        //  A shadow (appears below the currently dragged piece)
        this.shadow = null;

        //  The Group of piece Sprites
        this.pieces = null;

        //  A Sprite that appears on completion
        this.wellDone = null;

        this.action = this.states.SELECTING;
        this.data = data;
        this.setDifficulty();

    }

    setDifficulty()
    {
        const data = this.data;

        switch(data.difficulty)
        {
            case 'easy':{
                this.puzzleWidth = 3;
                this.puzzleHeight = 3;
                break;
            }
            case 'medium':{
                this.puzzleWidth = 6;
                this.puzzleHeight = 6;
                break;
            }
            case 'hard':{
                this.puzzleWidth = 8;
                this.puzzleHeight = 8;
                break;
            }
        }
    }

    create()
    {
        this.fadeIn();

        //  The background wood texture
        var background = this.add.sprite(0, 0, 'background');

        background.scale.setTo(0.5);

        //  The BitmapData that contains the selected image.
        const puzzleImageWidth = 760;
        const puzzleImageHeight = 505;

        let puzzleImage = this.cache.getImage(this.image);
        let bmd = this.make.bitmapData(760, 505);
        bmd.clear();

        let context = bmd.context;
        context.drawImage(puzzleImage, 0,0, puzzleImageWidth, puzzleImageHeight);

        //  And chop it up! This function will cut the BitmapData up, returning an object full of new
        //  pieces (each one a canvas). You can log out the data object to see its contents.
        var data = bmd.jigsawCut(this.puzzleWidth, this.puzzleHeight, this.lineWidth, this.lineStyle);

        //  A Group that all the jigsaw pieces will be put in.
        this.pieces = this.add.group();

        //  Center the jigsaw group
        this.pieces.x = (this.game.width - data.width) / 2;
        this.pieces.y = (this.game.height - data.height) / 2;

        this.pieces.inputEnableChildren = true;

        var coords = [];

        //  Here we loop through each piece in the data object.
        //  This creates a Sprite from each piece, using the piece canvas as the texture.
        //  The pieces are positioned perfectly, creating the final 'assembled' picture.
        //  A Circle object is created for each 'correct' piece, and input events are set-up.
        for (var x = 0; x < data.pieces.length; x++)
        {
            var column = data.pieces[x];

            for (var y = 0; y < column.length; y++)
            {
                var pieceData = column[y];

                var piece = this.pieces.create(pieceData.x, pieceData.y, PIXI.Texture.fromCanvas(pieceData.canvas));

                piece.input.enableDrag(false, false, true);

                piece.events.onDragStop.add(this.dropPiece, this);

                var cx = this.pieces.x + piece.centerX;
                var cy = this.pieces.y + piece.centerY;

                coords.push({ x: piece.x, y: piece.y });

                piece.data.correct = false;
                piece.data.dropX = pieceData.x;
                piece.data.dropY = pieceData.y;
                piece.data.hitCircle = new Phaser.Circle(cx, cy, this.hitCircleSize);
                piece.data.textureNoOutline = PIXI.Texture.fromCanvas(pieceData.canvasNoOutline);
            }
        }

        //  This shuffles up the piece coords, placing the jigsaw pieces in different locations.
        coords = Phaser.ArrayUtils.shuffle(coords);

        var i = 0;
        var _this = this;

        //  And this adds a little variance (+- 32 pixels) to every piece, and a slight angle
        //  (between +- 6 degrees). In short, this mixes up our pieces so they're no longer
        //  in the right place on the board. You can tweak the various values here for a more
        //  dramatic, or subtle, effect. If you don't want the pieces rotated then simply
        //  comment out the `child.angle` line.
        coords.forEach(function(coord) {
            var child = _this.pieces.getChildAt(i);
            child.x = coords[i].x + _this.rnd.between(-32, 32);
            child.y = coords[i].y + _this.rnd.between(-32, 32);
            child.angle = _this.rnd.between(-6, 6);
            i++;
        });

        //  Add our Shadow piece. This appears below the piece being dragged.
        this.shadow = this.pieces.create(0, 0);
        this.shadow.data.correct = true;
        this.shadow.visible = false;
        this.shadow.input.enabled = false;

        //  Add the corner sprites, to help with jigsaw alignment when playing.
        //
        //  Each corner is 48x48 pixels in size, aligned to the four
        //  edges of the pieces Group.
        //  You can comment out this whole section if you don't need this.

        this.add.sprite(this.pieces.x, this.pieces.y, 'corner1a');
        this.add.sprite(this.pieces.x + data.width - 48, this.pieces.y, 'corner1b');
        this.add.sprite(this.pieces.x, this.pieces.y + data.height - 48, 'corner1c');
        this.add.sprite(this.pieces.x + data.width - 48, this.pieces.y + data.height - 48, 'corner1d');

        //  The Well Done sprite that appears on completion
        this.wellDone = this.add.sprite(0, 0, 'wellDone');
        this.wellDone.centerX = this.world.centerX;
        this.wellDone.visible = false;

        //  Start the event handler going
        this.pieces.onChildInputDown.add(this.selectPiece, this);
        this.action = this.states.SELECTING;

        this.createBackButton();
        this.createWords();

    }
    createWords()
    {
        
        const word = this.add.text(0,0,this.data.word.word);
        word.anchor.set(0.5);
        word.font = 'Arial';
        word.fontSize = 20;
        word.fill = '#000000';
        word.stroke = '#FFFFFF';
        word.strokeThickness = 3;
        word.x = this.game.width / 2;
        word.y = 35;
        word.resolution = 2;

        const translation = this.add.text(0,0,this.data.word.translation);
        translation.anchor.set(0.5);
        translation.font = 'Arial';
        translation.fontSize = 20;
        translation.fill = '#000000';
        translation.stroke = '#FFFFFF';
        translation.strokeThickness = 3;
        translation.x = this.game.width / 2;
        translation.y = this.game.height - 20;;
        translation.resolution = 2;
    }

    createBackButton()
    {
        const back = this.add.text(0,0,'Back');
        back.anchor.set(0, 0);
        back.font = 'Arial';
        back.fontSize = 20;
        back.fill = '#FFFFFF';
        back.stroke = '#000000';
        back.strokeThickness = 3;
        back.x = 20;
        back.y = 10;
        back.inputEnabled = true;
        back.input.useHandCursor = true;
        back.events.onInputDown.add(()=>{
            back.fill = '#000000';
            back.stroke = '#FFFFFF';
            this.state.start('GameTitle');
        })
        back.resolution = 2;

    }

    /**
     * Called when a piece is picked-up.
     * It's responsible for creating a new shadow piece below it, and fading out the other
     * pieces if set.
     */
    selectPiece (piece) {

        if (this.action !== this.states.SELECTING || piece.data.correct)
        {
            return;
        }

        this.current = piece;

        this.action = this.states.PLACING;

        //  You want the piece to be straight when trying to place it.
        piece.angle = 0;

        //  Creates the shadow sprite below the piece.
        this.shadow.loadTexture(piece.texture);
        this.shadow.tint = 0x000000;
        this.shadow.alpha = 0.5;
        this.shadow.x = piece.x + 8;
        this.shadow.y = piece.y + 8;
        this.shadow.visible = true;

        //  We need the shadow at the top of the Group ...
        this.shadow.bringToTop();

        //  ... but obviously behind the piece being dragged
        piece.bringToTop();

        //  Fade out the other un-sorted pieces
        if (this.hidePiecesOnPickup)
        {
            this.pieces.forEach(this.hidePiece, this);
        }

    }

    /**
     * Hides a single piece of the jigsaw. This is a simple linear tween.
     */
    hidePiece (piece) {

        if (piece !== this.current && piece.data.correct === false)
        {
            this.add.tween(piece).to({ alpha: 0 }, 100, "Linear", true);
        }

    }

    /**
     * Shows a single piece of the jigsaw. This is a simple linear tween.
     */
    showPiece (piece) {

        if (piece !== this.current && piece.data.correct === false)
        {
            this.add.tween(piece).to({ alpha: 1 }, 250, "Linear", true);
        }

    }

    dropPiece(sprite, pointer)
    {
       this.hitTestCircle.x = this.pieces.x + sprite.centerX;
        this.hitTestCircle.y = this.pieces.y + sprite.centerY;

        //  Does the piece being dragged intersect with its hit circle?
        //  i.e. the place where it _should_ actually be dropped.
        if (Phaser.Circle.intersects(this.hitTestCircle, this.current.data.hitCircle))
        {
            //  Yup! So we'll enter DROPPING mode, and tween the piece into place.
            sprite.data.correct = true;
            sprite.input.enabled = false;

            this.action = this.states.DROPPING;

            var tween = this.add.tween(sprite).to( { x: sprite.data.dropX, y: sprite.data.dropY }, 500, "Linear", true);

            tween.onComplete.addOnce(this.checkJigsaw, this);
        }
        else
        {
            //  No match, so we'll go back to SELECTING mode.
            this.action = this.states.SELECTING;

            //  Show the remaining pieces.
            if (this.hidePiecesOnPickup)
            {
                this.pieces.forEach(this.showPiece, this);
            }
        }

        //  Reset current and hide the shadow.
        this.current = false;
        this.shadow.visible = false;
    }

    /**
     * This is called after a piece is dropped into the area it is supposed to be put, and has
     * finished tweening into place. It then checks to see if the jigsaw is completed or not.
     */
    checkJigsaw (droppedPiece) {

        //  Put the dropped piece to the back of the Group.
        droppedPiece.sendToBack();

        //  Swap for our 'no outline' texture, so that the final picture appears seamless
        droppedPiece.loadTexture(droppedPiece.data.textureNoOutline);

        //  Count how many pieces are in the correct place?
        var correct = 0;

        this.pieces.forEach(function(piece) {
            if (piece.data.correct)
            {
                correct++;
            }
        });

        //  All of them, excellent, you've completed the jigsaw.
        if (correct === this.pieces.total)
        {
            //  Tween in our 'Well Done' sprite.
            this.wellDone.y = 0;
            this.wellDone.visible = true;
            var audio = this.add.audio(this.data.word.audioKey);
            audio.play();

            var tween = this.add.tween(this.wellDone).to({ y: 250 }, 1500, "Bounce.easeOut", true);
            tween.onComplete.addOnce(this.puzzleComplete, this);
        }
        else
        {
            //  Not finished yet, go back into SELECTING mode.
            if (this.hidePiecesOnPickup)
            {
                this.pieces.forEach(this.showPiece, this);
            }

            this.action = this.states.SELECTING;
        }

    }


    /**
     * Called when the Well Done sprite has tweened into place.
     * Just waits for a click and then returns to pick a new puzzle.
     */
    puzzleComplete () {
        this.game.input.onDown.addOnce(this.chooseNewPuzzle, this);
    }

    chooseNewPuzzle () {
        this.state.start('GameTitle', true);
    }

    /**
     * In the preRender we update the position of the shadow sprite to match
     * the currently dragged piece (if there is one).
     */
    preRender () {

        if (this.current)
        {
            //  The 8 values is the offset of the shadow from the piece being dragged.
            this.shadow.x = this.current.x + 8;
            this.shadow.y = this.current.y + 8;
        }

    }
    update()
    {

    }


    fadeIn()
    {
        var fadeBackground = this.game.add.graphics(0, 0);
        fadeBackground.beginFill(0xFFFFFF, 1);
        fadeBackground.drawRect(0, 0, this.game.width, this.game.height);
        fadeBackground.alpha = 1;
        fadeBackground.endFill();

        const backgroundTween = this.game.add.tween(fadeBackground);
        backgroundTween.to({ alpha: 0 }, 500, null);
        backgroundTween.start();
    }

    gameOver()
    {
        this.game.state.start("GameOver", true);
    }
}

export default Main;
