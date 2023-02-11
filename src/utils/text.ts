import { GameObjects, Scene } from 'phaser';
export class Text extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, text: string) {
    super(scene, x, y, text, {
        fontSize: '10px',
        resolution: 1,
        font: 'Arial'
    });
    this.setOrigin(0, 0);
    scene.add.existing(this);
    }
}