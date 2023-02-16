import Phaser from "phaser";
import { newEvent as events } from "../events/eventCenter";
export default class GameUI extends Phaser.Scene {
    private HealthBar!: Phaser.GameObjects.Graphics
    private ExperienceBar!: Phaser.GameObjects.Graphics;

    constructor() {
        super('ui-scene')
    }

    create() {
        this.HealthBar = this.setBar(100, 10, 10, 100, 7);
        this.ExperienceBar = this.setBar(0, 430, 350, 150, 15);

        this.add.image(495,60,'borderMap')

        events.on('player-health-changed',this.handleHealthPlayerChanged ,this)

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.events.off('player-health-changed', this.handleHealthPlayerChanged, this)
        })
    }


    private handleHealthPlayerChanged(value: number) {
        this.setBar(value, 10, 10, 100, 7, this.HealthBar)
    }

    private setBar(value: number,x :number, y: number, width: number, height: number, graph?: Phaser.GameObjects.Graphics ) {
        let graphics: Phaser.GameObjects.Graphics;
        if (typeof graph === 'undefined') {
            graphics = this.add.graphics();
        } else {
            graphics = graph;
        }
        const percent = Phaser.Math.Clamp(value, 0, 100) / 100;

        graphics.fillStyle(0x808080);
        graphics.fillRoundedRect(x, y, width, height, 1);

        if (percent > 0) {
            graphics.fillStyle(0x00ff00)
            graphics.fillRoundedRect(x, y, percent * width, height, 1);
        }

        return graphics;
    }

}