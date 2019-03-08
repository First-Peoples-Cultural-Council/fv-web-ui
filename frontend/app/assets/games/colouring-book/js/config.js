
let defaultGameConfig = {

    libs:{
        bitmapDataFloodFill:'assets/libs/BitmapDataFloodFill.js',
        blob:'assets/libs/Blob.js',
        canvasToBlob:'assets/libs/CanvasToBlob.js',
        fileSaver:'assets/libs/FileSaver.js'
    },

    images:{
        preloaderLoading:'assets/images/loading.png',
        preloaderLogo:'assets/images/logo.png',
        swatch:'assets/images/swatch.png',
        selected:'assets/images/selected.png',
        print:'assets/images/print.png',
        save:'assets/images/save.png',
        picture1:'assets/images/picture1.png',
        picture2:'assets/images/picture2.png',
        picture3:'assets/images/picture3.png',
        picture4:'assets/images/picture4.png',
        thumb1:'assets/images/thumb1.png',
        thumb2:'assets/images/thumb2.png',
        thumb3:'assets/images/thumb3.png',
        thumb4:'assets/images/thumb4.png',
        background:'assets/images/background.png'
    }

};

let gameConfig = {};

export default {

    setConfig:(config) => {
        gameConfig = Object.assign({}, defaultGameConfig, config, gameConfig);
    },

    getConfig:() => {
        return gameConfig;
    }
}