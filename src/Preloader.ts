import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
    constructor ()
    {
        super('preloader');
    }

    preload()
    {
        this.load.image('tiles', 'tiles/Tiles.png');
        this.load.image('props', 'tiles/Props.png');
        this.load.image('trees', 'tiles/Trees.png');
        this.load.tilemapTiledJSON('map', 'tiles/map.tmj');

        this.load.atlas('fauna','character/fauna.png','character/fauna.json');
    }

    create()
    {
        this.scene.start('game');
    }
}