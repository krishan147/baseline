import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { audioButton } from './Options.js';
import { readLocally } from './Access.js'
import { looking_for_game } from './Access.js'


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

        const match_txt = this.add.text(75, 400, 'FINDING MATCH...', { 
            fill: '#0f0', 
            fontSize: '30px', 
            strokeThickness: 1, 
            stroke: '#0f0', 
            fontFamily: 'playwritereg', 
            padding: { right: 65 } 
        });

        this.tweens.add({
            targets: match_txt,
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

    
    
        try {
            var response = await looking_for_game(gameData, gameData["online_bet"]);
        
            if (response?.Item?.data === "No match found") {

                match_txt.setText("NO MATCH FOUND.\n TRY AGAIN IN 1 MIN.")

                setTimeout(() => {
                    this.scene.start('Menu');
                }, 3000);


            } else if (response?.Item?.data === "Match Found") {
                console.log("Match Found, redirecting to PlayOnline...");
                this.scene.start('PlayOnline');
            } else {
                console.error("Unexpected response data:", response);
            }
        } catch (error) {
            console.error("Error occurred while looking for a game:", error);
        }
        
    }

}
