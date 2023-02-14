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
        this.load.image('MasterSimple', 'tiles/MasterSimple.png');
        this.load.image('town', 'tiles/town.png')
        this.load.tilemapTiledJSON('map', 'tiles/map.tmj');
        this.load.image('borderMap', 'tiles/UI/border.png');

        this.load.atlas('fauna','character/fauna.png','character/fauna.json');
        this.load.atlas('dino', 'enemies/dino/DinoSprites - mort.png', 'enemies/dino/DinoSprites - mort.json')


        this.load.image('fireball', 'spells/fireball/fireball.png')
    }

    create()
    {
        this.scene.start('game');
    }
}