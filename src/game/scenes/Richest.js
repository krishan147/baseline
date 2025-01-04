import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { audioButton } from './Options.js';
import { readLocally, get_top_ten } from './Access.js'


export class Richest extends Scene {
    constructor() {
        super('Richest');
    }

    preload() {}

    async create() {

        var gameData = await readLocally()
        var volume = gameData["volume"]
        var isChecked = gameData["mute"]

        this.cameras.main.setBackgroundColor(0x000000);

        const title = this.add.text(50, 110, 'RICH LIST', { fill: '#0f0', fontSize: '60px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}}).setAlpha(0);

        const descrip = this.add.text(50, 200, 'RICHEST ONLINE PLAYERS', { fill: 'white', fontSize: '20px', strokeThickness: 1, stroke: 'white', fontFamily: 'playwritereg' }).setAlpha(0);

        let data = await get_top_ten()

        console.log(data)

        const startX = 50;
        const startY = 250;
        const rowHeight = 30;
    
        this.add.text(startX, startY, 'RANK', { fill: '#fff', fontSize: '20px', fontFamily: 'playwritereg',padding: { right: 35} });
        this.add.text(startX + 100, startY, 'PLAYER', { fill: '#fff', fontSize: '20px', fontFamily: 'playwritereg',padding: { right: 35} });
        this.add.text(startX + 300, startY, 'COINS', { fill: '#fff', fontSize: '20px', fontFamily: 'playwritereg',padding: { right: 35} });
    
        data.forEach((row, index) => {
            const y = startY + (index + 1) * rowHeight;
    
            this.add.text(startX, y, row.rank.toString(), { fill: '#fff', fontSize: '18px', fontFamily: 'playwritereg' });
    
            this.add.text(startX + 100, y, row.playerName, { fill: '#fff', fontSize: '18px', fontFamily: 'playwritereg' });
    
            this.add.text(startX + 300, y, row.gold_multi.toString(), { fill: '#fff', fontSize: '18px', fontFamily: 'playwritereg' });
        });

        

        

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
            targets: [title, descrip],    
            alpha: 1,               
            duration: 2000,        
            ease: 'Power2',    
            onComplete: function() {
            }
        });
        
        EventBus.emit('current-scene-ready', this);
    }

}
