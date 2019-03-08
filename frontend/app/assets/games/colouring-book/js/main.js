

class Main {

    create()
    {
        //  The fill color comparison tolerance.
        //  Between 0 (no comparison at all during fill) and 255.
        //  Realistically you wouldn't usually put this larger than 128.
        this.tolerance = 50;

        this.thumbnails = null;

        this.key = '';

        this.bmd = null;
        this.bmdContainer = null;

        this.color = null;

        this.saveIcon = null;
        this.printIcon = null;

        this.swatch = null;
        this.selectedColor = null;
        this.swatchColorWidth = 16;
        this.swatchColorHeight = 30;

        //  Textured paper background
        // this.add.sprite(0, 0, 'paper');
        this.background = this.add.sprite(0,0,'background');
        this.background.scale.setTo(0.5,0.5);
        this.createThumbnails();
        this.fadeIn();
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

    /**
     * Here we loop through and create 4 thumbnails, for each of the 4 pictures you can
     * color in. Each one is input enabled, and when you mouse-over it, it'll scale and
     * rotate slightly to indicate an over state.
     */
    createThumbnails () {

        this.thumbnails = this.add.group();
        this.thumbnails.inputEnableChildren = true;
        this.thumbnails.createMultiple(1, ['thumb1', 'thumb2', 'thumb3', 'thumb4'], 0, true);
        this.thumbnails.setAll('input.useHandCursor', 'input', true);
        this.thumbnails.callAll('anchor.set', 'anchor', 0.5);

        this.thumbnails.align(2, 2, 400, 300, Phaser.CENTER);

        this.thumbnails.onChildInputOver.add(this.overThumb, this);
        this.thumbnails.onChildInputOut.add(this.outThumb, this);
        this.thumbnails.onChildInputUp.add(this.selectThumb, this);

    }

    /**
     * Called when the mouse is over a thumbnail. Applies a small scale and rotation.
     */
    overThumb (thumbnail) {

        thumbnail.scale.set(1.1);
        thumbnail.angle = 4;

    }

    /**
     * Called when the mouse leaves a thumbnail. Removes the small scale and rotation.
     */
    outThumb (thumbnail) {

        thumbnail.scale.set(1);
        thumbnail.angle = 0;

    }

    /**
     * Called when the player clicks a thumbnail.
     * Sets the local proper `this.key` to be the picture the user selected.
     */
    selectThumb (thumbnail) {

        this.background.visible = false;
        
        this.key = thumbnail.key.replace('thumb', 'picture');

        this.thumbnails.destroy();

        this.start();

    }

    /**
     * This is the meat of the set-up, called when a thumbnail is picked.
     * It creates the BitmapData that will be filled, and places the rest of the game
     * UI into the scene (the icons and so on). See the comments within this function
     * for more details.
     */
    start () {

        //  The BitmapData on which the fill takes place
        this.bmd = this.add.bitmapData();

        //  Load the black and white outline picture into it.
        this.bmd.load(this.key);

        //  And add it to the world, so it becomes visible.
        this.bmdContainer = this.bmd.addToWorld();

        //  Enable input for this sprite, so we can tell when it's clicked.
        this.bmdContainer.inputEnabled = true;
        this.bmdContainer.events.onInputDown.add(this.fill, this);

        //  This just centers it in the bottom-middle of the screen.
        this.bmdContainer.centerX = this.world.centerX;
        this.bmdContainer.bottom = this.game.height;

        //  This applies a small alpha to the image, allowing you to see
        //  the paper texture through it. You can remove this depending
        //  on what your requirements are.
        this.bmdContainer.alpha = 1;

        //  A copy of the image to be filled, placed over the top of the canvas
        //  This keeps the outline fresh, no matter how much filling takes place
        //  It could also contain a watermark or similar.
        var overlay = this.add.sprite(0, 0, this.key);
        overlay.x = this.bmdContainer.x;
        overlay.y = this.bmdContainer.y;
        overlay.alpha = this.bmdContainer.alpha;

        //  The save icon
        this.saveIcon = this.add.sprite(8, 456, 'save');
        this.saveIcon.inputEnabled = true;
        this.saveIcon.input.useHandCursor = true;
        this.saveIcon.events.onInputUp.add(this.save, this);

        //  The print icon
        this.printIcon = this.add.sprite(8, 528, 'print');
        this.printIcon.inputEnabled = true;
        this.printIcon.input.useHandCursor = true;
        this.printIcon.events.onInputUp.add(this.print, this);

        //  The palette swatch
        //  This is just a PNG we created in PhotoShop, that detects clicks on it.
        //  We then get the pixel color value from the swatch click, and use that
        //  as the new fill color. You could replace this technique with anything
        //  you require, or replace this swatch image. All that matters is that
        //  the fill color is loaded somehow.
        this.swatch = this.add.bitmapData();
        this.swatch.load('swatch');
        this.swatch.update();

        var swatchContainer = this.swatch.addToWorld();

        swatchContainer.inputEnabled = true;

        swatchContainer.events.onInputDown.add(this.pickColor, this);

        //  A little sprite marker to show which color is currently selected
        //  in our swatch.
        this.selectedColor = this.add.sprite(0, 0, 'selected');

        //  Pick a default color
        this.pickColor(null, { x: 360, y: 0 });

    }

    /**
     * When the mouse is pressed down on the color swatch Sprite, this function
     * is called. All it does is get the pixel color value from the underlying
     * BitmapData, and set that into the `this.color` property. Finally the
     * swatch selector sprite is moved.
     */
    pickColor (sprite, pointer) {

        if (pointer.y <= 60)
        {
            var x = Math.round(pointer.x);
            var y = Math.round(pointer.y);


            //  Get the color from the swatch
            var pixel = this.swatch.getPixel32(x, y);

            //  Use this function to normalize between big and little endian
            this.color = Phaser.Color.unpackPixel(pixel);
            
            //  And update the swatch color selection marker
            this.selectedColor.x = this.math.snapToFloor(x, this.swatchColorWidth);

            if (y < 30)
            {
                this.selectedColor.y = 0;
            }
            else
            {
                this.selectedColor.y = 30;
            }
        }

    }

    /**
     * Called when the picture is clicked.
     *
     * Simple calculates the x and y value of the click, and passes that along with the
     * currently selected color to the BitmapData.floodFill routine.
     *
     * After filling the 'outline' is re-applied, so it never gets destroyed by the fill
     * process. If you are using a tolerance of 0 then this doesn't need to happen, we
     * only do it because our outline is aliased slightly.
     */
    fill (sprite, pointer) {

        if (pointer.y < 64)
        {
            return;
        }

        this.bmd.floodFill(
            pointer.x - this.bmdContainer.x,
            pointer.y - this.bmdContainer.y,
            this.color.r,
            this.color.g,
            this.color.b,
            this.color.a,
            this.tolerance);

        //  After filling, we'll re-apply the outline, so it never gets 'destroyed' by the fill
        this.bmd.copy(this.key);

        //  And update the pixel data, ready for the next fill
        this.bmd.update();

    }

    /**
     * Called when the user clicks the Print icon.
     *
     * Opens a printer dialog with the image on.
     */
    print () {

        //  You can add whatever HTML you need here, such as a logo, or copyright text,
        //  and it will be printed along with the image.

        var win = window.open();
        win.document.write("<br><img src='" + this.bmd.canvas.toDataURL() + "'/>");
        win.print();
        win.location.reload();

    }

    /**
     * Called when the user clicks the Save icon.
     *
     * Saves the colored-in image, without the paper texture. If you want to
     * include the paper texture, or maybe add in your own watermark, then you
     * could create a temporary BitmapData and draw the various elements to it,
     * then use that in the `toBlob` call below instead.
     *
     * Note that this operation is browser / device specific, i.e. it won't work
     * on iOS, but does work on desktop browsers.
     */
    save () {

        var _this = this;

        this.bmd.canvas.toBlob(function(blob) {
            saveAs(blob, _this.key + ".png");
        });
    }

    update()
    {

    }

    gameOver()
    {
        this.game.state.start("GameOver");
    }
}

export default Main;
