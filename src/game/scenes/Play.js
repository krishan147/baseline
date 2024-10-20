import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { audioButton } from './Options.js';
import Phaser from 'phaser';
import { readLocally } from './Access.js'

export class Play extends Scene
{
    constructor ()
    {
        super('Play');
    }

    preload () {
        this.load.image('particle', 'spritesheet/particle.png');
    }

    async create ()
    {
        var gameData = await readLocally()
        var volume = gameData["volume"]
        var isChecked = gameData["mute"]
        var playerName = gameData["playerName"]
        var str_coins = gameData["gold_cpu"]
        var game_type = gameData["game_type"]
        var opponent_name = 'CPU'
        

        this.cameras.main.setBackgroundColor(0x000000);

        const title = this.add.text(50, 110, game_type, { fill: '#0f0', fontSize: '60px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}})
        .setInteractive()
        .on('pointerdown', () => {
            title.setStyle({ fill: '#ffff00'});
            window.open('http://krishgames.com', '_blank');
        audioButton(isChecked)
        })


 
        // runVictory.call(this)
       // runDefeat.call(this)


        function runVictory() {
        
        const particles_obj = this.add.particles('particle');
        const emitters = [];

        const dict_colors = [
            { tint: 0xFF49F7, gravityY: 125, xloc: 0, yloc: -25 },
            { tint: 0x00FF00, gravityY: 125, xloc: 70, yloc: -25 },
            { tint: 0xFFFFFF, gravityY: 125, xloc: 140, yloc: -25 },
            { tint: 0xFFFF00, gravityY: 125, xloc: 210, yloc: -25 },
            { tint: 0x992C94, gravityY: 125, xloc: 280, yloc: -25 },
            { tint: 0xFF0000, gravityY: 125, xloc: 350, yloc: -25 },
            { tint: 0xFF7F27, gravityY: 125, xloc: 420, yloc: -25 },
            { tint: 0x0000FF, gravityY: 125, xloc: 500, yloc: -25 },
          ];
          
          dict_colors.forEach(color => {
            const emitter = this.add.particles(color.xloc, color.yloc, "particle", {
              lifespan: 5000,
              angle: { min: 0, max: 180 },
              speed: 250,
              frequency: 10,
              scale: { start: 1, end: 1 },
              gravityY: color.gravityY,
              tint: color.tint,
            });
            emitters.push(emitter);
          });
          
          setTimeout(() => {
            emitters.forEach(emitter => emitter.stop());
          }, 3000);


          const victory = this.add.text(100, 400, 'VICTORY', { fill: '#0f0', fontSize: '240px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding:{right:50}})
        
          const colors = [
              { r: 255, g: 0, b: 0 },   // Red
              { r: 0, g: 255, b: 0 },   // Green
              { r: 0, g: 0, b: 255 },   // Blue
              { r: 255, g: 255, b: 0 },   // Yellow
              { r: 0, g: 255, b: 255 },   // Cyan
              { r: 255, g: 0, b: 255 },   // Magenta
              { r: 255, g: 165, b: 0 },   // Orange
          ];
          
          let colorIndex = 0;
  
          this.tweens.add({
              targets: victory,
              scaleX: 0.25, 
              scaleY: 0.25, 
              ease: 'Power2', 
              duration: 2000,
              onComplete: () => {
                  victory.setFontSize('240px'); 
              }
          });
  
  
          this.tweens.addCounter({
              from: 0,
              to: 100,
              duration: 3000,    // Duration of the tween in milliseconds
              repeat: -1,        // Repeat indefinitely
              yoyo: true,        // Reverse direction each time the tween completes
              onUpdate: tween => {
                  const value = tween.getValue();
                  const nextColorIndex = (colorIndex + 1) % colors.length;
                  const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                      colors[colorIndex],
                      colors[nextColorIndex],
                      100,
                      value
                  );
          
                  const colorString = Phaser.Display.Color.RGBToString(
                      color.r,
                      color.g,
                      color.b,
                      0,
                      '#'
                  );
          
                  victory.setStyle({ fill: colorString, stroke: colorString });
          
                  if (value === 100) {
                      colorIndex = nextColorIndex;
                  }
              }
          });


        }

        function runDefeat() {
            const defeat = this.add.text(100, 400, 'DEFEAT', { fill: '#0f0', fontSize: '240px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding:{right:50}})
            
            this.tweens.add({
                targets: defeat,
                scaleX: 0.25, 
                scaleY: 0.25, 
                ease: 'Power2', 
                duration: 2000,
                onComplete: () => {
                    defeat.setFontSize('240px'); 
                }
            });
        }

        if (gameData["game_type"] == "online_play"){
            opponent_name = 'jimmy'
        }

        const oppenent_username = this.add.text(10, 100, 'OPPONENT: ' + opponent_name, { fill: '#0f0', fontSize: '20px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}})

        const username = this.add.text(10, 800, 'YOU: ' + playerName, { fill: '#0f0', fontSize: '20px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}})

        let lastClickTime = 0;
        let clickedOnce = false; // Track if clicked once
        let message; // To hold the temporary message
        
        const backButton = this.add.text(320, 785, 'FORFEIT', { fill: '#0f0', fontSize: '30px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding:{right:50}})
            .setInteractive()
            .on('pointerdown', () => {
                const currentTime = this.time.now;
                const timeSinceLastClick = currentTime - lastClickTime;
        
                if (timeSinceLastClick < 2000 && clickedOnce) { // Second click within 2 seconds
                    backButton.setStyle({ fill: '#ffff00' });
                    audioButton(isChecked);
                    this.scene.start('Menu');
                } else {
                    // First click, show message and set clickedOnce flag
                    if (!clickedOnce) {
                        clickedOnce = true;
                        lastClickTime = currentTime;
        
                        // Display a temporary message to press again
                        message = this.add.text(165, 755, 'PRESS AGAIN TO FORFEIT', { fill: 'yellow', fontSize: '20px', fontFamily: 'playwritereg', padding:{right:20}});
        
                        // Hide the message after 2 seconds
                        this.time.delayedCall(2000, () => {
                            message.destroy();
                            clickedOnce = false; // Reset after 2 seconds
                        });
                    }
                }
            });

    

        EventBus.emit('current-scene-ready', this);
    }
}
