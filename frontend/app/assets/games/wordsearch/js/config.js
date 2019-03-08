let defaultGameConfig = {

    libs:{
        wordFindScript:'assets/libs/wordfind.js'        
    },

    images:{
        preloaderLoading:'assets/images/loading.png',
        preloaderLogo:'assets/images/logo.png',
        tile:'assets/images/tile.png',
        playAudio:'assets/images/play_audio.png',
        background:'assets/images/background.png',
        title:'assets/images/title.png',
        welldone:'assets/images/well-done.png'
    },

    letters:[],

    words:[
        {
            word:"łuk’é",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"chíze",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"asd oaskd o",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"dįnį deneyu",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"dįnį",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"nąntł’er",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"xait’ázį́",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        },  
        {
            word:"dekai",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"ek’egwi",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"yaghe",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"eghéasdzé",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"jíedeniyéri",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"bagheasdtél",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        },  
        {
            word:"tthábes",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        },  
        {
            word:"łus",
            translation:"translation",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }
    ]

};


let gameConfig = {};

export default {

    setConfig:(config) => {
        gameConfig = Object.assign({}, defaultGameConfig, config, gameConfig);
    },

    reset:() => {
        gameConfig = {};
    },

    getConfig:() => {
        return gameConfig;
    }
}