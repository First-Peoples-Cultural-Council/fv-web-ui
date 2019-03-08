import configManager from './config';

class GameTitle {

    init() {
        this.config = configManager.getConfig();
        this.page = 0
        this.pageOffset = 700;
        this.thumbsPerPage = 4;
        this.thumbWidth = 300;
        this.thumbHeight = 175;
        this.thumbMargins = 200 / 3;
        this.currentPage = false;
        this.maxPage = (Math.ceil(this.config.words.length / this.thumbsPerPage) - 1);
    }

    create() {
        const sprite = this.add.sprite(0, 0, 'background');
        sprite.scale.setTo(0.5);
        this.createThumbnails();
    }

    createThumbnails() {
        
        const config = this.config;
        const words = config.words;
        const pages = this.add.group();

        /**
         * Thumbpage
         */
        let thumbPage = this.make.group();
        thumbPage.inputEnableChildren = true;
        thumbPage.visible = true;
        this.currentPage = thumbPage;

        /**
         * Pages
         */
        pages.add(thumbPage);
        
        /**
         * Loop through thumbs
         */
        words.forEach((word, index) => {
            
            if(index !== 0 && (index % this.thumbsPerPage) === 0)
            {
                thumbPage = this.make.group();
                thumbPage.visible = false;
                pages.add(thumbPage);
            }
            
            const thumb = this.createThumb(word);
            thumbPage.add(thumb);
        });

        pages.forEach((group)=>{
            group.align(2,2,this.thumbWidth + this.thumbMargins, this.thumbHeight + this.thumbMargins)
            group.x = this.thumbMargins;
            group.y = this.thumbMargins + 40;
        });

        this.pages = pages;
        this.createTitle();
        this.createPageButtons();

    }


    /**
     * Create Thumb
     * @returns thumbnail
     */
    createThumb(word)
    {
        const thumbWidth = this.thumbWidth;
        const thumbHeight = this.thumbHeight;
        const thumbMargins = this.thumbMargins;

        const thumb = this.make.image(0, 0, word.pictureKey);
        thumb.width = thumbWidth;
        thumb.height = thumbHeight;
        thumb.inputEnabled = true;
        thumb.input.useHandCursor = true;
        thumb.data = { width: 3, height: 3, img: word.pictureKey, word };
        thumb.anchor.setTo(0.5);

        const thumbShadow = this.make.image(0, 0, word.pictureKey);
        thumbShadow.width = thumb.width;
        thumbShadow.height = thumb.height;
        thumbShadow.tint = 0x000000;
        thumbShadow.alpha = 0.6;
        thumbShadow.x = 5;
        thumbShadow.y = 5;
        thumbShadow.anchor.setTo(0.5);

        const border = this.make.graphics(0, 0);
        border.lineStyle(4, 0x000000, 1);
        border.drawRect(-(thumb.width / 2), -(thumb.height / 2), thumb.width, thumb.height);

        const thumbGroup = this.make.group();
        thumbGroup.add(thumbShadow);
        thumbGroup.add(thumb);
        thumbGroup.add(border);
        thumbGroup.onChildInputUp.add(this.selectThumb, this);

        return thumbGroup;
    }


    /**
     * Create Title 
     */
    createTitle()
    {
        //  One BitmapText per word (so we can change their color when found)
        var title = this.add.text(0, 0, 'Choose a Puzzle');
        title.anchor.set(0, 0);
        title.font = 'Arial';
        title.fontSize = 35;
        title.fill = '#FFFFFF';
        title.stroke = '#000000';
        title.strokeThickness = 3;
        title.anchor.x = 0.5;
        title.anchor.y = 0.5;
        title.x = this.game.width / 2;
        title.y = 45;
        title.setShadow(1, 1, '#000000', 1);
        title.resolution = 2;

    }


    /**
     * Create Page Buttons
     */
    createPageButtons()
    {
        if (this.maxPage > 0) {

            var nextPage = this.add.image(this.game.width - 50, this.game.height - 30, 'arrow');
            nextPage.anchor.setTo(0.5)
            nextPage.inputEnabled = true;
            nextPage.input.useHandCursor = true;
            nextPage.events.onInputUp.add(() => {
                if (this.page < this.maxPage) {
                    this.page++;

                    const page =this.pages.getChildAt(this.page);
                    page.visible = true;
                    page.x = 1000;

                    this.add.tween(page).to({x:this.thumbMargins}, 1000, Phaser.Easing.Elastic.Out, true);
                    this.add.tween(this.currentPage).to({x:-1000}, 1000, Phaser.Easing.Elastic.Out, true);

                    this.currentPage = page;
                    this.previousPageButton.visible = true;

                    if (this.page >= this.maxPage) {
                        this.nextPageButton.visible = false;
                    }
                }
            });

            //Previous Page Button 
            var previousPage = this.add.image(50, this.game.height - 30, 'arrow');
            previousPage.anchor.setTo(0.5)
            previousPage.angle = 180;
            previousPage.inputEnabled = true;
            previousPage.input.useHandCursor = true;
            previousPage.visible = false;
            previousPage.events.onInputUp.add(() => {
                if (this.page > 0) {
                    this.page--;

                    const page = this.pages.getChildAt(this.page);
                    page.visible = true;
                    page.x = -1000;
                    
                    this.add.tween(page).to({x:this.thumbMargins}, 1000, Phaser.Easing.Elastic.Out, true);
                    this.add.tween(this.currentPage).to({x:1000}, 1000, Phaser.Easing.Elastic.Out, true);

                    this.currentPage.visible = false;
                    this.currentPage = page;

                    if (this.page === 0) {
                        this.previousPageButton.visible = false;
                        this.nextPageButton.visible = true;
                    }
                }
            });

            this.previousPageButton = previousPage;
            this.nextPageButton = nextPage;
        }
    }



    /**
     * Select thumb
     * @param thumbnail
     */
    selectThumb(thumbnail) {
        var data = thumbnail.data;
        this.state.start("DifficultySelect", true, false, data);
    }
}

export default GameTitle;
