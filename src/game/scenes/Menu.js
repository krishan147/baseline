import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { audioButton } from './Options.js';
//import { getPlayer } from './Sounds.js'
// import { updatePlayer2 } from './Sounds.js';

// updatePlayer2(1, "gold_cpu", 1000)

var game_version = 'v0.107'

export class Menu extends Scene
{
    constructor ()
    {
        super('Menu');
    }

    preload() {
        this.load.image('grass', 'spritesheet/grass.png');
        this.load.spritesheet({
            key: 'female_idle',
            url: 'spritesheet/Player_Female_A_T1_Idle_North_Left_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });
        this.load.spritesheet({
            key: 'female_idle2',
            url: 'spritesheet/Player_Female_A_T1_Idle_North_Right_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });
        this.load.spritesheet({
            key: 'female_idle3',
            url: 'spritesheet/Player_Female_A_T1_Idle_South_Right_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });
        this.load.spritesheet({
            key: 'female_idle4',
            url: 'spritesheet/Player_Female_A_T1_Idle_South_Left_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });

    }

    create ()
    {
        var gameDataString = localStorage.getItem('myGameData');
        var gameData = JSON.parse(gameDataString);
        var volume = gameData["volume"]
        var isChecked = gameData["mute"]
        var playerName = gameData["playerName"]

        this.cameras.main.setBackgroundColor(0x000000);


        const version = this.add.text(0, 40, game_version, { fill: '#0f0', fontSize: '10px', fontFamily: 'playwritereg',padding: { right: 35}})


        const title = this.add.text(50, 110, 'BASELINE', { fill: '#0f0', fontSize: '60px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}})

        const byText = this.add.text(50, 190, 'BY ', { fill: '#0f0', fontSize: '20px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg' });

        const krishgames = this.add.text(byText.x + byText.width, 190, 'KRISHGAMES', { fill: '#0f0', fontSize: '20px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg' })
            .setInteractive()
            .on('pointerdown', () => {
                krishgames.setStyle({ fill: '#ffff00' });
                setTimeout(() => {
                    krishgames.setStyle({ fill: '#0f0' });
                }, 200);
                audioButton(isChecked);
                window.open('http://krishgames.com', '_blank');
            })
            .on('pointerover', () => {
                krishgames.setStyle({ fill: '#ffff00' });
            })
            .on('pointerout', () => {
                krishgames.setStyle({ fill: '#0f0' });
            });
  

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


        var list_anims = ["female_idle", "female_idle2", "female_idle3", "female_idle4"]

        var anim_to_run = list_anims[Math.floor(Math.random() * list_anims.length)];

        this.anims.create({
            key: anim_to_run,
            frames: this.anims.generateFrameNumbers(anim_to_run, { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        let botSprite = this.add.sprite(270, 360, anim_to_run).setAlpha(0);
        botSprite.setTint(0x00FF00);
        botSprite.play(anim_to_run);


        const onlineButton = this.add.text(50, 510, 'ONLINE PLAY', { 
            fill: '#0f0', 
            fontSize: '30px', 
            strokeThickness: 1, 
            stroke: '#0f0', 
            fontFamily: 'playwritereg', 
            padding: { right: 35 } 
        })
        .setInteractive()
        .on('pointerdown', () => {
            onlineButton.setStyle({ fill: '#ffff00' });
            audioButton(isChecked);
            this.scene.start('Bet');
        })
        .on('pointerover', () => {
            onlineButton.setStyle({ fill: '#ffff00' });
        })
        .on('pointerout', () => {
            onlineButton.setStyle({ fill: '#0f0' });
        })
        .setAlpha(0);

        const offlineButton = this.add.text(50, 580, 'OFFLINE PLAY', { fill: '#0f0', fontSize: '30px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}})
        .setInteractive()
        .on('pointerdown', () => {
            offlineButton.setStyle({ fill: '#ffff00'});
        audioButton(isChecked)
        this.scene.start('Bet');
    })
    .on('pointerover', () => {
        offlineButton.setStyle({ fill: '#ffff00' });
    })
    .on('pointerout', () => {
        offlineButton.setStyle({ fill: '#0f0' });
    })
    .setAlpha(0);

        const richestButton = this.add.text(50, 650, 'RICHEST PLAYERS', { fill: '#0f0', fontSize: '30px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}})
        .setInteractive()
        .on('pointerdown', () => {
            richestButton.setStyle({ fill: '#ffff00'});
        audioButton(isChecked)
        this.scene.start('Richest');
    })
    .on('pointerover', () => {
        richestButton.setStyle({ fill: '#ffff00' });
    })
    .on('pointerout', () => {
        richestButton.setStyle({ fill: '#0f0' });
    })
    .setAlpha(0);

    const optionsButton = this.add.text(50, 720, 'OPTIONS', { fill: '#0f0', fontSize: '30px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}})
    .setInteractive()
    .on('pointerdown', () => {
        optionsButton.setStyle({ fill: '#ffff00'});

        audioButton(isChecked)
        this.scene.start('Options');
    })
    .on('pointerover', () => {
        optionsButton.setStyle({ fill: '#ffff00' });
    })
    .on('pointerout', () => {
        optionsButton.setStyle({ fill: '#0f0' });
    })
    .setAlpha(0);

    // 840
    const username = this.add.text(10, 800, 'NAME: '+ playerName, { fill: '#0f0', fontSize: '20px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}}).setAlpha(0)

    this.tweens.add({
        targets: [botSprite, onlineButton, username, optionsButton, richestButton, offlineButton],    
        alpha: 1,               
        duration: 1000,        
        ease: 'Power2',    
        onComplete: function() {
        }
    });


    EventBus.emit('current-scene-ready', this);
    }

    
}
