import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { audioButton } from './Options.js';
import Phaser from 'phaser';
import { readLocally, writeLocally, patchPlayer } from './Access.js'
import { looking_for_game } from './Access.js'

export class Bet extends Scene
{
    constructor ()
    {
        super('Bet');
    }

    preload () {
        this.load.image('particle', 'spritesheet/particle.png');
        this.load.image('grass', 'spritesheet/grass.png');

        this.load.spritesheet({
            key: 'run1',
            url: 'spritesheet/Player_Female_A_T1_Run_North_Left_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });
        this.load.spritesheet({
            key: 'run2',
            url: 'spritesheet/Player_Female_A_T1_Run_North_Right_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });
        this.load.spritesheet({
            key: 'run3',
            url: 'spritesheet/Player_Female_A_T1_Run_South_Right_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });
        this.load.spritesheet({
            key: 'run4',
            url: 'spritesheet/Player_Female_A_T1_Run_South_Left_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });
    }

    async create ()
    {

        var gameData = await readLocally()
        var volume = gameData["volume"]
        var isChecked = gameData["mute"]
        var playerName = gameData["playerName"]
        var str_coins = gameData["gold_cpu"]

        this.cameras.main.setBackgroundColor(0x000000);

        const title = this.add.text(50, 110, 'BET', { fill: '#0f0', fontSize: '60px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}}).setAlpha(0)
        
        const grassImages = [];
        const startX = 0; 
        const startY = 250; 
        const gapX = 35; 
        const gapY = 45;
  
        for (let row = 0; row < 6; row++) { 
          for (let col = 0; col < 16; col++) {
            const x = startX + col * gapX;
            const y = startY + row * gapY;
            const grassImage = this.add.image(x, y, 'grass');
            grassImage.alpha = 0;
            grassImage.setTint(0x00FF00);
            grassImages.push(grassImage);
          }
        }

        this.tweens.add({
            targets: grassImages,    
            alpha: 1,               
            duration: 2000,        
            ease: 'Power2',    
            onComplete: function() {
            }
        });

        var list_anims = ["run1", "run2", "run3", "run4"]

        var anim_to_run = list_anims[Math.floor(Math.random() * list_anims.length)];

        this.anims.create({
            key: anim_to_run,
            frames: this.anims.generateFrameNumbers(anim_to_run, { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1
        });

        let botSprite = this.add.sprite(270, 360, anim_to_run).setAlpha(0);
        botSprite.setTint(0x00FF00);
        botSprite.play(anim_to_run);

        this.tweens.add({
            targets: [botSprite],    
            alpha: 1,               
            duration: 6000,        
            ease: 'Power2',    
            onComplete: function() {
            }
        });
 
        let currentBet = null;
        var bet_to_execute = null

        const buttons = [
            { text: 'NONE', y: 530, x: 50 , frequency:1000, bet_x:110, bet_y:550},
            { text: '100', y: 530, x: 200, frequency:24, bet_x:260, bet_y:550 },
            { text: '200', y: 530, x: 350, frequency:16, bet_x:380, bet_y:550 },
            { text: '500', y: 610, x: 50, frequency:12, bet_x:90, bet_y:630 },
            { text: '1000', y: 610, x: 200, frequency:6, bet_x:240, bet_y:630 },
            { text: '2000', y: 610, x: 350, frequency:2, bet_x:400, bet_y:630 }
        ];

        buttons.forEach(button => {
            const newButton = this.add.text(button.x, button.y, button.text, {
                fill: '#0f0', // Initial color green
                fontSize: '30px',
                strokeThickness: 1,
                stroke: '#0f0',
                fontFamily: 'playwritereg',
                padding: { right: 35 }
            })
            .setInteractive()
            .on('pointerdown', async () => {
                if (currentBet) {
                    currentBet.setStyle({ fill: '#0f0' }); // Reset previous button color to green
                }
                newButton.setStyle({ fill: '#ffff00' }); // Set clicked button color to yellow
                currentBet = newButton; // Update the reference to the current button
        
                bet_to_execute = button.text;

                if (bet_to_execute === 'NONE' || bet_to_execute === null) {
                    bet_to_execute = 0;
                }

                bet_to_execute = parseInt(bet_to_execute);

                console.log("bet_to_execute", bet_to_execute)

                if (gameData["game_type"] == "offline_play"){
                    gameData["offline_bet"] = bet_to_execute
                }

                if (gameData["game_type"] == "online_play"){
                    gameData["online_bet"] = bet_to_execute
                }

                
                writeLocally(gameData)
                gameData = await readLocally()
        
                audioButton(isChecked);
                betEffect.call(this, button.frequency, button.bet_x, button.bet_y);
            })
            .on('pointerover', () => {
                if (newButton !== currentBet) {
                    newButton.setStyle({ fill: '#ffff00' }); // Hover color yellow
                }
            })
            .on('pointerout', () => {
                if (newButton !== currentBet) {
                    newButton.setStyle({ fill: '#0f0' }); // Mouse out color green
                }
            });
        });
        
        const confirm = this.add.text(50, 690, 'START GAME', { fill: '#0f0', fontSize: '30px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding: { right: 35 } })
        .setInteractive()
        .on('pointerdown', async () => {
            confirm.setStyle({ fill: '#ffff00' });
            audioButton(isChecked);

            var game_type = gameData["game_type"]

            if (gameData["game_type"] == "offline_play"){
                patchPlayer(gameData["playerId"], "offline_bet", gameData["offline_bet"])
            }

            if (gameData["game_type"] == "online_play"){
                patchPlayer(gameData["playerId"], "online_bet", gameData["online_bet"])
            }

            if (game_type == "online_play"){
                this.scene.start('Wait');
            }

            if (game_type == "offline_play"){

                this.scene.start('Play');
            }


            
        })
        .on('pointerover', () => {
            confirm.setStyle({ fill: '#ffff00' });
        })
        .on('pointerout', () => {
            confirm.setStyle({ fill: '#0f0' });
        })
        .setAlpha(0);

        function betEffect(frequency, bet_x, bet_y) {

            const betEmitter = this.add.particles(bet_x, bet_y, "particle", {
                lifespan: 2500,
                angle: { min: 0, max: 360 },
                speed: 250,
                frequency: frequency,
                scale: { start: 1, end: 1 },
                gravityY: 225,
                tint: 0xffff00,
            });
        
            this.time.delayedCall(500, () => {
                betEmitter.stop();
            });
        }

  
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
        }).setAlpha(0)



        

        const coins = this.add.text(10, 770, 'COINS: ' + str_coins, { fill: '#0f0', fontSize: '20px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}}).setAlpha(0)
        const username = this.add.text(10, 800, 'YOU: ' + playerName, { fill: '#0f0', fontSize: '20px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}}).setAlpha(0)
    
        this.tweens.add({
            targets: [username, coins, backButton, confirm, title],    
            alpha: 1,               
            duration: 1000,        
            ease: 'Power2',    
            onComplete: function() {
            }
        });

        EventBus.emit('current-scene-ready', this);
    }
}
