const path = require('path');
const webpack = require('webpack');

const appRootPath = path.join(__dirname, '../');
// Phaser webpack config
const phaserModule = path.join(appRootPath, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')


module.exports = {
    entry:{
        app: path.resolve(appRootPath,"scripts/entry.js"),
        vendor:['pixi', 'p2', 'phaser']
    },
    output:{
        path:path.resolve(appRootPath,"www/"),
        filename:"bundle.js"
    },
    plugins:[
        new webpack.optimize.CommonsChunkPlugin({  name: 'vendor', minChunks: Infinity, filename: 'vendor.bundle.js'})
    ],
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