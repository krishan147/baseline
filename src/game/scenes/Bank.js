import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { audioButton } from './Options.js';
import { readLocally } from './Access.js'


export class Bank extends Scene {
    constructor() {
        super('Bank');
    }

    preload() {}

    async create() {

        var gameData = await readLocally()
        var volume = gameData["volume"]
        var isChecked = gameData["mute"]

        this.cameras.main.setBackgroundColor(0x000000);

        const title = this.add.text(50, 110, 'BANK', { fill: '#0f0', fontSize: '60px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}}).setAlpha(0);

        const richTitle = this.add.text(150, 400, 'BANK', { fill: '#0f0', fontSize: '30px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg' });

        const backButton = this.add.text(350, 785, 'BACK', { fill: '#0f0', fontSize: '30px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding:{right:50}})
        .setInteractive()
        .on('pointerdown', () => {
            backButton.setStyle({ fill: '#ffff00'});
        audioButton(isChecked)
        this.scene.start('Menu');
    })
    .on('pointerover', () => {
        backButton.setStyle({ fill: '#ffff00' });
    })
    .on('pointerout', () => {
        backButton.setStyle({ fill: '#0f0' });
    })
        this.tweens.add({
            targets: [title],    
            alpha: 1,               
            duration: 2000,        
            ease: 'Power2',    
            onComplete: function() {
            }
        });
        
        EventBus.emit('current-scene-ready', this);
    }

}
