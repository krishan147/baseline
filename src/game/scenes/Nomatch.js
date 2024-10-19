import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Nomatch extends Scene {
    constructor() {
        super('Nomatch');
    }

    preload() {}

    async create() {

        this.cameras.main.setBackgroundColor(0x000000);

        const no_match_msg = this.add.text(115, 400, '        NO MATCH \n TRY AGAIN IN 1 MIN', { 
            fill: '#0f0', 
            fontSize: '30px', 
            strokeThickness: 1, 
            stroke: '#0f0', 
            fontFamily: 'playwritereg', 
            padding: { right: 55 } 
        });
        this.time.delayedCall(2000, () => {
            this.scene.start('Menu');
        }, [], this);
    }

}
