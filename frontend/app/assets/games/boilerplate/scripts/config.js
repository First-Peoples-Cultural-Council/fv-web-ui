let defaultGameConfig = {

    images:{
        preloaderLoading:'assets/images/loading.png',
        preloaderLogo:'assets/images/load.png',
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