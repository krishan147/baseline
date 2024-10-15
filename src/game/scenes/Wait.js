import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { audioButton } from './Options.js';
import { readLocally } from './Access.js'


export class Wait extends Scene {
    constructor() {
        super('Wait');
    }

    preload() {}

    async create() {

        var gameData = await readLocally()
        var volume = gameData["volume"]
        var isChecked = gameData["mute"]

        this.cameras.main.setBackgroundColor(0x000000);

        const richTitle = this.add.text(150, 400, 'FINDING MATCH...', { 
            fill: '#0f0', 
            fontSize: '30px', 
            strokeThickness: 1, 
            stroke: '#0f0', 
            fontFamily: 'playwritereg', 
            padding: { right: 55 } 
        });

        this.tweens.add({
            targets: richTitle,
            alpha: 0.25,                 
            duration: 750,             
            ease: 'Power2',
            yoyo: true,                
            repeat: -1                
        });

        const cancelButton = this.add.text(325, 785, 'CANCEL', { 
            fill: '#0f0', 
            fontSize: '30px', 
            strokeThickness: 1, 
            stroke: '#0f0', 
            fontFamily: 'playwritereg', 
            padding: { right: 30 }
        })
        .setInteractive()
        .on('pointerdown', () => {
            cancelButton.setStyle({ fill: '#ffff00' });
            audioButton(isChecked);
            this.scene.start('Menu');
        })
        .on('pointerover', () => {
            cancelButton.setStyle({ fill: '#ffff00' });
        })
        .on('pointerout', () => {
            cancelButton.setStyle({ fill: '#0f0' });
        });
    }

}
