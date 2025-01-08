import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { audioButton } from './Options.js';
import { readLocally, writeLocally, get_game_w_session_id, get_play, post_play } from './Access.js'

var game_version = 'v0.121'

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

    async create ()
    {

        var gameData = await readLocally()
        var volume = gameData["volume"]
        var isChecked = gameData["mute"]
        var playerName = gameData["playerName"]

        this.cameras.main.setBackgroundColor(0x000000);


        const version = this.add.text(10, 40, game_version, { fill: '#0f0', fontSize: '10px', fontFamily: 'playwritereg',padding: { right: 35}})


        const title = this.add.text(50, 110, 'BREAKPOINT', { fill: '#0f0', fontSize: '50px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}}).setAlpha(0)
  

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
            gameData["game_type"] = "online_play"
            writeLocally(gameData)
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
        gameData["game_type"] = "offline_play"
        writeLocally(gameData)
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

    const username = this.add.text(10, 790, 'YOU: '+ playerName, { fill: '#0f0', fontSize: '20px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}}).setAlpha(0)
    .setInteractive()
    .on('pointerdown', () => {
        username.setStyle({ fill: '#ffff00'});

        audioButton(isChecked)
        this.scene.start('Bank');
    })
    .on('pointerover', () => {
        username.setStyle({ fill: '#ffff00' });
    })
    .on('pointerout', () => {
        username.setStyle({ fill: '#0f0' });
    })

    this.tweens.add({
        targets: [botSprite, onlineButton, username, optionsButton, richestButton, offlineButton, title],    
        alpha: 1,               
        duration: 1000,        
        ease: 'Power2',    
        onComplete: function() {
        }
    });

    let dict_match = {
        "id":"12345",
        "you":"name",
        "opponent":"name",
        "you_position":"right",
        "opponent_position":"left",
        "you_last_position": "right",
        "opponent_last_position":"left",
        "you_decided":false,
        "opponent_decided":false,
        "ball_possession":"you",
        "you_score":0,
        "opponent_score":0,
        "end":false,
        "match_ball_possession":"you",
        "ball_position":"right",
        "ball_position_new":"right",
        "cpu":true,
        "winner":null,
        "loser":null,
        "forfeit":null,
        "session_id":null
    }

    //testing button
    // const testButton = this.add.text(300, 720, 'TEST', { fill: '#0f0', fontSize: '30px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}})
    // .setInteractive()
    // .on('pointerdown', () => {
    //     post_play(dict_match)
    // });

    


    


    EventBus.emit('current-scene-ready', this);
    }

    
}


