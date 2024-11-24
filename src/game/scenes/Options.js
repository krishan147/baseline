import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Phaser from 'phaser';
import { readLocally } from './Access.js'
import { writeLocally } from './Access.js'
import { patchPlayer } from './Access.js'
import { resetGameLocally } from './Access.js'
import { signOut } from 'aws-amplify/auth';

var audio_music = new Audio('/sounds/music.mp3')
// audio_music.play()
var audio_button = new Audio('/sounds/menu_button.wav')



export class Options extends Scene
{
    constructor ()
    {
        super('Options');
    }

    preload() {
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
        var playerId = gameData["playerId"]
        
        this.cameras.main.setBackgroundColor(0x000000);

        const title = this.add.text(50, 110, 'OPTIONS', { fill: '#0f0', fontSize: '60px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}})

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
            frames: this.anims.generateFrameNumbers(anim_to_run, { start: 0, end: 3 }),
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

        const muteTitle = this.add.text(150, 510, 'MUTE', { fill: '#0f0', fontSize: '30px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}})

        const checkboxSize = 50;
        const checkboxX = 300;
        const checkboxY = 510;
    
        const checkbox = this.add.rectangle(checkboxX, checkboxY, checkboxSize, checkboxSize, 0x00FF00)
          .setStrokeStyle(2, 0x000000) // Border color
          .setOrigin(0); // Origin at top-left for easier alignment
    
        const checkmark = this.add.text(checkboxX + checkboxSize / 2, checkboxY + checkboxSize / 1.8, '✔', { 
            fontSize: `${checkboxSize}px`, 
            color: '#00000' 
        }).setOrigin(0.5).setVisible(false); // Center the checkmark in the checkbox
        
        checkmark.setVisible(isChecked);

        checkbox.setInteractive({ useHandCursor: true });
    
        checkbox.on('pointerdown', () => {
          isChecked = !isChecked; // Toggle state
          checkmark.setVisible(isChecked); // Show or hide checkmark based on state
          audioButton(isChecked)
          this.events.emit('checkboxToggled', isChecked);

          checkMute(volume, isChecked);

        });

        const volumeTitle = this.add.text(50, 570, 'VOLUME', { fill: '#0f0', fontSize: '30px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}})

        // Slider bar properties
        const sliderBarX = 250;
        const sliderBarY = 595;
        const sliderBarWidth = 200;
        const sliderBarHeight = 50;

        // Handle properties
        const handleRadius = 15;
        const handleY = sliderBarY + sliderBarHeight / 2;
        volume = volume/100
        // Calculate the initial handle X position based on the initial volume
        const handleX = sliderBarX + (volume * sliderBarWidth);

        // Draw the slider bar
        const sliderBar = this.add.rectangle(sliderBarX, sliderBarY, sliderBarWidth, sliderBarHeight, 0xffffff)
        .setOrigin(0, 0.5); // Centered vertically

        // Draw the slider handle
        const sliderHandle = this.add.circle(handleX, handleY, handleRadius, 0x00FF00).setInteractive({ useHandCursor: true, draggable: true });

        // Add input drag events for the handle
        this.input.setDraggable(sliderHandle);

        // Function to interpolate between two colors
        const interpolateColor = (color1, color2, factor) => {
        const r1 = (color1 >> 16) & 0xff;
        const g1 = (color1 >> 8) & 0xff;
        const b1 = color1 & 0xff;

        const r2 = (color2 >> 16) & 0xff;
        const g2 = (color2 >> 8) & 0xff;
        const b2 = color2 & 0xff;

        const r = Phaser.Math.Interpolation.Linear([r1, r2], factor);
        const g = Phaser.Math.Interpolation.Linear([g1, g2], factor);
        const b = Phaser.Math.Interpolation.Linear([b1, b2], factor);



        return (r << 16) | (g << 8) | b;
        };

        const initialColor = interpolateColor(0xffffff, 0x00ff00, volume);
        sliderBar.fillColor = initialColor;

        sliderHandle.on('drag', (pointer, dragX) => {
        const newX = Phaser.Math.Clamp(dragX, sliderBarX, sliderBarX + sliderBarWidth);
        sliderHandle.x = newX;

        const volume = (newX - sliderBarX) / sliderBarWidth;

        const newColor = interpolateColor(0xffffff, 0x00ff00, volume);
        sliderBar.fillColor = newColor;

        audioButton(isChecked)
        var volume_int = Math.floor(volume * 100);
        gameData["volume"] = volume_int
        writeLocally(gameData);
        checkMute(volume, isChecked);
        });

        function checkMute(volume, isChecked){

            if (isChecked == true){
                audio_music.volume = 0
                audio_button.volume = 0

                gameData["mute"] = true
                writeLocally(gameData);
            }

            if (isChecked == false){
                audio_music.volume = volume
                audio_button.volume = volume

                gameData["mute"] = false
                writeLocally(gameData);
            }

        }

        async function signOutCheck() {
            resetGameLocally();
            await signOut({ global: true });
        }
        
        const signOutText = this.add.text(150, 640, 'SIGN OUT ', { fill: '#0f0', fontSize: '30px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg' })
            .setInteractive()
            .on('pointerdown', () => {
                signOutText.setStyle({ fill: '#ffff00' });
                audioButton(isChecked);
                signOutCheck();
            })
            .on('pointerover', () => {
                signOutText.setStyle({ fill: '#ffff00' });
            })
            .on('pointerout', () => {
                signOutText.setStyle({ fill: '#0f0' });
            });
        

        const privacyPolicy = this.add.text(100, 690, 'PRIVACY POLICY ', { fill: '#0f0', fontSize: '30px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg' })            .setInteractive()
        .on('pointerdown', () => {
            privacyPolicy.setStyle({ fill: '#ffff00' });
            setTimeout(() => {
                privacyPolicy.setStyle({ fill: '#0f0' });
            }, 200);
            audioButton(isChecked);
            window.open('https://krishgames.com/privacyPolicy.html', '_blank');
        })
        .on('pointerover', () => {
            privacyPolicy.setStyle({ fill: '#ffff00' });
        })
        .on('pointerout', () => {
            privacyPolicy.setStyle({ fill: '#0f0' });
        });

        const byText = this.add.text(20, 740, 'MADE BY ', { fill: '#0f0', fontSize: '30px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg' });

        const krishgames = this.add.text(byText.x + byText.width, 740, 'KRISHGAMES', { fill: '#0f0', fontSize: '30px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding:{right:30}})
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
        

        const username = this.add.text(10, 800, 'YOU: ' + playerName, { fill: '#0f0', fontSize: '20px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}})
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


        EventBus.emit('current-scene-ready', this);
    }
}


export async function audioButton(isChecked) {
    try {
        if (isChecked === false) {
            await audio_button.play();
        }
    } catch (error) {
        console.error("Audio playback failed:", error);
    }
}
