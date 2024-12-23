import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { audioButton } from './Options.js';
import { readLocally } from './Access.js'
import { post_game, get_game } from './Access.js'


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
            const response = await post_game(gameData, gameData["online_bet"]);
            for (let attempt = 0; attempt < 3; attempt++) {
                
                if (response?.Item?.data === "Finding game") {
                    const game_data = await get_game();
        
                    if (game_data["game"] === "found_game") {
                        this.scene.start('PlayOnline');
                        return game_data; 
                    } else {
                        console.log("No game found, retrying...");
                    }
                } else {
                    console.log("Response did not indicate 'Finding game'.");
                    finding_game_failed(this)
                    break;
                }
        
                if (attempt < 2) {
                    await new Promise(resolve => setTimeout(resolve, 2000)); 
                }
            }
            
            console.log("Game not found after 3 attempts.");
            finding_game_failed(this)
            return null;

        } catch (error) {
            finding_game_failed(this)
        }


        function finding_game_failed(scene){
            match_txt.setText("NO MATCH FOUND.\n TRY AGAIN IN 1 MIN.")

            setTimeout(() => {
                scene.scene.start('Menu');
            }, 3000);
        }
        
    }

}
