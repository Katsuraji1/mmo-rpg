import Phaser from "phaser";
import { newEvent as events } from "../events/eventCenter";
export default class GameUI extends Phaser.Scene {

    private graphics!: Phaser.GameObjects.Graphics

    constructor() {
        super('ui-scene')
    }

    create() {
        this.graphics = this.add.graphics();
        this.setHealthBar(100);

        events.on('player-health-changed',this.handleHealthPlayerChanged ,this)

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.events.off('player-health-changed', this.handleHealthPlayerChanged, this)
        })
    }


    private handleHealthPlayerChanged(value: number) {
        this.setHealthBar(value)
    }

    private setHealthBar(value: number) {
        const width = 100;
        const percent = Phaser.Math.Clamp(value, 0, 100) / width;

        this.graphics.fillStyle(0x808080);
        this.graphics.fillRoundedRect(10, 10, width, 7, 1);

        if (percent > 0) {
            this.graphics.fillStyle(0x00ff00)
            this.graphics.fillRoundedRect(10, 10, percent * width, 7, 1);
        }
    }

}