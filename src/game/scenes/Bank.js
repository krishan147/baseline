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

        const title = this.add.text(50, 110, 'BANK DETAILS', { fill: '#0f0', fontSize: '40px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}}).setAlpha(0);

        const name_txt = this.add.text(50, 200, 'NAME:', { fill: 'white', fontSize: '30px', strokeThickness: 1, stroke: 'white', fontFamily: 'playwritereg',padding: { right: 35}});
        const name = this.add.text(50, 250, gameData["playerName"], { fill: 'white', fontSize: '30px', strokeThickness: 1, stroke: 'white', fontFamily: 'playwritereg',padding: { right: 35}});
        const email_txt = this.add.text(50, 320, 'EMAIL:', { fill: 'white', fontSize: '30px', strokeThickness: 1, stroke: 'white', fontFamily: 'playwritereg',padding: { right: 35}});
        const email = this.add.text(50, 370, gameData["email"], { fill: 'white', fontSize: '30px', strokeThickness: 1, stroke: 'white', fontFamily: 'playwritereg',padding: { right: 35}});
        const online_total_txt = this.add.text(50, 440, 'TOTAL ONLINE COINS:', { fill: 'white', fontSize: '30px', strokeThickness: 1, stroke: 'white', fontFamily: 'playwritereg',padding: { right: 35}});
        const online_total = this.add.text(50, 500, gameData["gold_multi"], { fill: 'white', fontSize: '30px', strokeThickness: 1, stroke: 'white', fontFamily: 'playwritereg',padding: { right: 35}});
        const offline_total_txt = this.add.text(50, 570, 'TOTAL OFFLINE COINS:', { fill: 'white', fontSize: '30px', strokeThickness: 1, stroke: 'white', fontFamily: 'playwritereg',padding: { right: 35}});
        const offline_total = this.add.text(50, 620, gameData["gold_cpu"], { fill: 'white', fontSize: '30px', strokeThickness: 1, stroke: 'white', fontFamily: 'playwritereg',padding: { right: 35}});
        const note = this.add.text(50, 680, 'IF OFFLINE/ONLINE COINS ARE UNDER 200,\n THEY RESET TO 1000 AT MIDNIGHT UTC', { fill: 'white', fontSize: '16px', strokeThickness: 1, stroke: 'white', fontFamily: 'playwritereg',padding: { right: 35}});


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
