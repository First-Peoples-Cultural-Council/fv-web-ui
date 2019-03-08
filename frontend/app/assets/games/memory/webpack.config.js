const path = require('path');
const webpack = require('webpack');

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

console.log(path.resolve(__dirname, 'entry.js'));

module.exports = {
    mode:'development',
    entry:{
        app:path.resolve(__dirname,'entry.js'),
        vendor:['pixi', 'p2', 'phaser']
    },
    output:{
        path:__dirname + '/www/',
        filename:"[name].js"
    },
    module:{
        rules:[
            {
                test: /\.js$/, exclude: /node_modules/, use: ['babel-loader']
            },
            {
                test:/\.css$/,
                use:['style-loader', 'css-loader']
            },
            {
                test:/pixi\.js/,
                use:{
                    loader:'expose-loader',
                    query:'PIXI'
                }
            },
            {
                test:/phaser-split\.js$/,
                use:{
                    loader:'expose-loader',
                    query:'Phaser'
                }
            },
            {
                test:/p2\.js/,
                use:{
                    loader:'expose-loader',
                    query:'p2'
                }
            }
        ]
    },
    resolve:{
        alias:{
            phaser:phaser,
            pixi:pixi,
            p2:p2
        }
    }
}