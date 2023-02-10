import Phaser from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
    constructor() {
        super('hello-world');
    }

    preload() {
        this.load.setBaseURL('http://labs.phaser.io');
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    create() {}
}
