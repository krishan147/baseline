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
        this.load.image('grass', 'spritesheet/grass.png');

        this.load.spritesheet({
            key: '1_female_idle_left',
            url: 'spritesheet/Player_Female_A_T1_Idle_North_Left_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });

        this.load.spritesheet({
            key: '1_female_idle_right',
            url: 'spritesheet/Player_Female_A_T1_Idle_North_Right_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });

        this.load.spritesheet({
            key: '1_female_run_left',
            url: 'spritesheet/Player_Female_A_T1_Run_North_Left_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });

        this.load.spritesheet({
            key: '1_female_run_right',
            url: 'spritesheet/Player_Female_A_T1_Run_North_Right_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });

        this.load.spritesheet({
            key: '1_female_hit_left',
            url: 'spritesheet/Player_Female_A_T1_Hit_North_Left_strip3_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 3
            }
        }); 

        this.load.spritesheet({
            key: '1_female_hit_right',
            url: 'spritesheet/Player_Female_A_T1_Hit_North_Right_strip3_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 3
            }
        }); 

        this.load.spritesheet({
            key: '2_female_idle_left',
            url: 'spritesheet/Player_Female_A_T1_Idle_South_Left_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });

        this.load.spritesheet({
            key: '2_female_idle_right',
            url: 'spritesheet/Player_Female_A_T1_Idle_South_Right_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });

        this.load.spritesheet({
            key: '2_female_run_right',
            url: 'spritesheet/Player_Female_A_T1_Run_South_Right_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });

        this.load.spritesheet({
            key: '2_female_run_left',
            url: 'spritesheet/Player_Female_A_T1_Run_South_Left_strip4_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 4
            }
        });

        this.load.spritesheet({
            key: '2_female_hit_right',
            url: 'spritesheet/Player_Female_A_T1_Hit_South_Right_strip3_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 3
            }
        });

        this.load.spritesheet({
            key: '2_female_hit_left',
            url: 'spritesheet/Player_Female_A_T1_Hit_South_Left_strip3_scaled_10x_pngcrushed.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 3
            }
        });

        this.load.spritesheet({
            key: 'test_particle',
            url: 'spritesheet/particle.png',
            frameConfig: {
                frameWidth: 240,
                frameHeight: 240,
                startFrame: 0,
                endFrame: 3
            }
        });

        this.load.image('racketcap','spritesheet/racketcap.png');

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

        const grassImages = [];
        const startX = 55; 
        const startY = 225; 
        const gapX = 35; 
        const gapY = 45;
  
        for (let row = 0; row < 11; row++) { 
          for (let col = 0; col < 12; col++) {
            const x = startX + col * gapX;
            const y = startY + row * gapY;
            const grassImage = this.add.image(x, y, 'grass');
            grassImage.alpha = 0;
            grassImage.setTint(0x00FF00);
            grassImages.push(grassImage);
          }
        }

        // court
        function drawLine(graphics, startX, startY, endX, endY, lineWidth = 3, color = 0xffffff, alpha = 1) {
            graphics.lineStyle(lineWidth, color, alpha);
            graphics.moveTo(startX, startY);
            graphics.lineTo(endX, endY);
            graphics.strokePath();
        }
        
        // Function to create multiple horizontal lines for the net
        function drawHorizontalNetLines(graphics, startX, endX, startY, lineSpacing, lineCount, lineWidth = 3, color = 0x000000, alpha = 1) {
            for (let i = 0; i < lineCount; i++) {
                drawLine(graphics, startX, startY + i * lineSpacing, endX, startY + i * lineSpacing, lineWidth, color, alpha);
            }
        }
        
        // Function to create multiple vertical lines for the net columns
        function drawVerticalNetColumns(graphics, startX, endX, topY, bottomY, spacing, lineWidth = 3, color = 0x000000, alpha = 1) {
            for (let x = endX; x >= startX; x -= spacing) {
                drawLine(graphics, x, topY, x, bottomY, lineWidth, color, alpha);
            }
        }
        
        // Function to create the net frame
        function drawNetFrame(graphics, leftX, rightX, topY, bottomY, lineWidth = 6, color = 0xffffff, alpha = 1) {
            drawLine(graphics, leftX + 2, topY, leftX + 2, bottomY, lineWidth, color, alpha); // right frame
            drawLine(graphics, leftX, topY, rightX, topY, lineWidth, color, alpha);           // top frame
            drawLine(graphics, rightX - 3, topY, rightX - 3, bottomY, lineWidth, color, alpha); // left frame
        }
        
        // Court
        const graphic_box = this.add.graphics();
        drawLine(graphic_box, 85, 270, 400, 270);
        drawLine(graphic_box, 400, 270, 430, 655);
        drawLine(graphic_box, 430, 655, 65, 655);
        drawLine(graphic_box, 65, 655, 85, 270);
        
        const graphic_left = this.add.graphics();
        drawLine(graphic_left, 115, 270, 105, 655);
        
        const graphic_right = this.add.graphics();
        drawLine(graphic_right, 365, 270, 385, 655);
        
        const graphic_middle = this.add.graphics();
        drawLine(graphic_middle, 240, 385, 240, 540);
        
        const graphic_bottom_box = this.add.graphics();
        drawLine(graphic_bottom_box, 110, 540, 380, 540);
        
        const graphic_top_box = this.add.graphics();
        drawLine(graphic_top_box, 112, 385, 370, 385);
        
        // Net horizontal lines
        const net = this.add.graphics();
        drawHorizontalNetLines(net, 65, 430, 425, 10, 5, 3, 0x000000);
        
        // Net vertical columns
        const net_col = this.add.graphics();
        drawVerticalNetColumns(net_col, 70, 420, 425, 475, 10, 3, 0x000000);
        
        // Net frame
        const net_frame = this.add.graphics();
        drawNetFrame(net_frame, 65, 430, 425, 475);


        this.tweens.add({
            targets: grassImages,    
            alpha: 1,               
            duration: 2000,        
            ease: 'Power2',    
            onComplete: function() {
            }
        });
        


 
       //  runVictory.call(this)
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


          const victory = this.add.text(100, 400, 'VICTORY', { fill: '#0f0', fontSize: '240px' ,strokeThickness: 10, stroke: '#0f0', fontFamily: 'playwritereg', padding:{right:50}})
        
          const colors = [
            { r: 0, g: 0, b: 0 },   // Black
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
            const defeat = this.add.text(100, 400, 'DEFEAT', { fill: 'black', fontSize: '240px' ,strokeThickness: 10, stroke: '#0f0', fontFamily: 'playwritereg', padding:{right:50}})
            
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

        let dict_match = {
            "id":12345,
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
            "ball_position_new":"right"
        }

        if (gameData["game_type"] == "online_play"){ // krishan need to work here
            opponent_name = 'jimmy'
        }

        function createBotAnimation(scene, animationKey, frameKey, startFrame, endFrame, frameRate, repeat) {
            // Create animation (does not play immediately)
            scene.anims.create({
                key: animationKey,
                frames: scene.anims.generateFrameNumbers(frameKey, { start: startFrame, end: endFrame }),
                frameRate: frameRate,
                repeat: repeat
            });
        }
        
        function createBotSprite(scene, frameKey, x, y, tint, scale) {
            // Create sprite and set properties without playing any animation
            let botSprite = scene.add.sprite(x, y, frameKey)
                .setTint(tint)
                .setScale(scale);
            return botSprite;
        }
        
        createBotAnimation(this, "1_female_idle_left", "1_female_idle_left", 0, 3, 5, -1);
        createBotAnimation(this, "1_female_run_left", "1_female_run_left", 0, 3, 5, -1);
        createBotAnimation(this, "1_female_run_right", "1_female_run_right", 0, 3, 5, -1);
        createBotAnimation(this, "1_female_idle_right", "1_female_idle_right", 0, 3, 5, -1);
        createBotAnimation(this, "1_female_hit_right", "1_female_hit_right", 0, 2, 7, 0);
        createBotAnimation(this, "1_female_hit_left", "1_female_hit_left", 0, 2, 7, 0);

        createBotAnimation(this, "2_female_idle_right", "2_female_idle_right", 0, 3, 5, -1);
        createBotAnimation(this, "2_female_idle_left", "2_female_idle_left", 0, 3, 5, -1);
        createBotAnimation(this, "2_female_hit_left", "2_female_hit_left", 0, 2, 7, 0);
        createBotAnimation(this, "2_female_hit_right", "2_female_hit_right", 0, 2, 7, 0);
        createBotAnimation(this, "2_female_run_right", "2_female_run_right", 0, 3, 5, -1); 
        createBotAnimation(this, "2_female_run_left", "2_female_run_left", 0, 3, 5, -1);

        
        let player_sprite = createBotSprite(this, "1_female_idle_right", 340, 590, 0x00FF00, 0.45);
        player_sprite.play("1_female_idle_right");

        let opponent_sprite = createBotSprite(this, "2_female_idle_left", 140, 260, 0x00FF00, 0.4);
        opponent_sprite.play("2_female_idle_left");

        function opponent_goes_right(scene){

            opponent_sprite.play("2_female_run_right")
            
            scene.tweens.add({
                targets: opponent_sprite,
                x: 340,            
                duration: 1200,   
                ease: 'Linear',
                onComplete: () => {
                    opponent_sprite.stop();
                    opponent_sprite.play("2_female_idle_right");
                  //  dict_match["opponent_position"] = "right"
                } 
            });
        }

        function opponent_goes_left(scene){

            opponent_sprite.play("2_female_run_left")
            
            scene.tweens.add({
                targets: opponent_sprite,
                x: 140,            
                duration: 1200,   
                ease: 'Linear',
                onComplete: () => {
                    opponent_sprite.stop();
                    opponent_sprite.play("2_female_idle_left");
                  //  dict_match["opponent_position"] = "left"
                } 
            });
        }

        function player_goes_right(scene){
            player_sprite.play("1_female_run_right")
            
            scene.tweens.add({
                targets: player_sprite,
                x: 340,            
                duration: 1200,   
                ease: 'Linear',
                onComplete: () => {
                    player_sprite.stop();
                    player_sprite.play("1_female_idle_right");
                  //  dict_match["you_position"] = "right"
                } 
            });

        }

        function player_goes_left(scene){

            player_sprite.play("1_female_run_left")

            scene.tweens.add({
                targets: player_sprite,
                x: 140,            
                duration: 1200,   
                ease: 'Linear',
                onComplete: () => {
                    player_sprite.stop();
                    player_sprite.play("1_female_idle_left");
                 //   dict_match["you_position"] = "left"
                } 
            });

        }

        const right_opponent = this.add.text(340, 140, 'RIGHT', { 
        })
        .setInteractive()
        .on('pointerdown', () => {
          decision_made(this, "opponent", true, "right")

        });

        const left_opponent = this.add.text(240, 140, 'LEFT', { 
        })
        .setInteractive()
        .on('pointerdown', () => {
          decision_made(this, "opponent", true, "left")
        });
       


        const right = this.add.text(340, 740, 'RIGHT', { 
            fill: '#0f0', 
            fontSize: '30px', 
            strokeThickness: 1, 
            stroke: '#0f0', 
            fontFamily: 'playwritereg', 
            padding: { right: 35 }
        })
        .setInteractive()
        .on('pointerdown', () => {
            right.setStyle({ fill: '#ffff00' });
            decision_made(this, "you", true, "right")
            
            this.time.delayedCall(200, () => {
                right.setStyle({ fill: '#0f0' });
            });
        });

        const left = this.add.text(50, 740, 'LEFT', { 
            fill: '#0f0', 
            fontSize: '30px', 
            strokeThickness: 1, 
            stroke: '#0f0', 
            fontFamily: 'playwritereg', 
            padding: { right: 35 }
        })
        .setInteractive()
        .on('pointerdown', () => {
            left.setStyle({ fill: '#ffff00' });
           decision_made(this, "you", true, "left")
                
            this.time.delayedCall(200, () => {
                left.setStyle({ fill: '#0f0' });
            });
        });

        let score_username_fig = 0
        let score_oppenent_fig = 0

        function decision_made(scene, name, decided, button){ // start again sort of and change position to button? perhaps we need ball_next_position, ball_current_position?

            let ball_possession_name = dict_match["ball_possession"];
            let no_ball_name = (ball_possession_name === "you") ? "opponent" : "you";
            var past = "no"

            if (dict_match[name + "_decided"] == false){

                if (ball_possession_name == name){
                    dict_match["ball_position_new"] = button
                    dict_match[name + "_last_position"] = dict_match[name + "_position"]
                } 
                
                if (no_ball_name == name){
                    dict_match[name + "_last_position"] = dict_match[name + "_position"]
                    dict_match[name + "_position"] = button
                }

                dict_match[name + "_decided"] = decided
            }
           
            if (dict_match["you_decided"] == true && dict_match["opponent_decided"] == true){

                if (dict_match[no_ball_name + "_position"] == dict_match["ball_position_new"]){
                    past = "no"
                } else {
                    past = "yes"
    
                    if (dict_match["ball_possession"] === "you"){
                        score_username_fig = score_username_fig + 1;
                        dict_match["you_score"] = score_username_fig
                        update_scores.call(scene); 
                    }
    
                    if (dict_match["ball_possession"] === "opponent"){
                        score_oppenent_fig = score_oppenent_fig + 1;
                        dict_match["opponent_score"] = score_oppenent_fig
                        update_scores.call(scene); 
                    }
    
                }

                player_action(scene, dict_match["ball_position"], dict_match["ball_position_new"], dict_match["ball_possession"], ball_possession_name, past);
                player_action(scene, dict_match["ball_position"], dict_match[no_ball_name + "_position"], dict_match["ball_possession"], no_ball_name, past);

                
            }

        }


        function player_action(scene, ball_position, button, ball_possession, player_name, past){
            
            if (ball_possession === "you" && player_name === "you"){
                with_ball(scene, ball_position, button, ball_possession, player_name, past)
            }

            if (ball_possession === "opponent" && player_name === "opponent"){
                with_ball(scene, ball_position, button, ball_possession, player_name, past)
            }

            if (player_name === "you" && ball_possession !== "you"){
                without_ball(scene, ball_position, button, ball_possession, player_name)
            }

            if (player_name === "opponent" && ball_possession !== "opponent"){
                without_ball(scene, ball_position, button, ball_possession, player_name)
            }

        }

        var who_goes_first
        var ball_possession

        function with_ball(scene, ball_position, button, ball_possession, player_name, past){

            if (ball_possession === "you"){

                if (ball_position === "left"){

                    if (button === "left" && player_name === "you"){

                        dict_match["ball_position"] = "left"
                        player_sprite.play("1_female_hit_left"); 
                        ball_movement(scene, "bottom_left_top_left", past)
                        player_sprite.on('animationcomplete-1_female_hit_left', function () {
                            player_sprite.play("1_female_idle_left");
                            
                        });

                    }

                    if (button === "right" && player_name === "you"){
                        console.log("hererer")
                        dict_match["ball_position"] = "right"
                        player_sprite.play("1_female_hit_left"); 
                        ball_movement(scene, "bottom_left_top_right", past)
                        player_sprite.on('animationcomplete-1_female_hit_left', function () {
                            player_sprite.play("1_female_idle_left");
                            
                        });
                    }

                }

                if (ball_position === "right"){

                    if (button === "left" && player_name === "you"){

                        dict_match["ball_position"] = "left"
                        player_sprite.play("1_female_hit_right"); 
                        ball_movement(scene, "bottom_right_top_left", past)
                        player_sprite.on('animationcomplete-1_female_hit_right', function () {
                            player_sprite.play("1_female_idle_right");
                            
                        });
                    }

                    if (button === "right" && player_name === "you"){
                        
                        dict_match["ball_position"] = "right"
                        player_sprite.play("1_female_hit_right"); 
                        ball_movement(scene, "bottom_right_top_right", past)
                        player_sprite.on('animationcomplete-1_female_hit_right', function () {
                            player_sprite.play("1_female_idle_right");
                            
                        });

                    }
                    
                }

            }

            if (ball_possession === "opponent"){

                if (ball_position === "left"){

                    if (button === "left" && player_name === "opponent"){

                        dict_match["ball_position"] = "left"
                        opponent_sprite.play("2_female_hit_left"); 
                        ball_movement(scene, "top_left_bottom_left", past)
                        opponent_sprite.on('animationcomplete-2_female_hit_left', function () {
                            opponent_sprite.play("2_female_idle_left");
                            
                        });

                    }

                    if (button === "right" && player_name === "opponent"){

                        dict_match["ball_position"] = "right"
                        opponent_sprite.play("2_female_hit_left"); 
                        ball_movement(scene, "top_left_bottom_right", past)
                        opponent_sprite.on('animationcomplete-2_female_hit_left', function () {
                            opponent_sprite.play("2_female_idle_left");
                            
                        });
                    }

                }

                if (ball_position === "right"){

                    if (button === "left" && player_name === "opponent"){

                        dict_match["ball_position"] = "left"
                        opponent_sprite.play("2_female_hit_right"); 
                        ball_movement(scene, "top_right_bottom_left", past)
                        opponent_sprite.on('animationcomplete-2_female_hit_right', function () {
                            opponent_sprite.play("2_female_idle_right");
                            
                        });
                    }

                    if (button === "right" && player_name === "opponent"){
                        
                        dict_match["ball_position"] = "right"
                        opponent_sprite.play("2_female_hit_right"); 
                        ball_movement(scene, "top_right_bottom_right", past)
                        opponent_sprite.on('animationcomplete-2_female_hit_right', function () {
                            opponent_sprite.play("2_female_idle_right");
                            
                        });

                    }
                    
                }

            }


        }

        function without_ball(scene, ball_position, button, ball_possession, player_name){

            if (button == dict_match[player_name + "_last_position"]){
                'pass'
            } else {

            if (player_name === "you"){

                if (button === "left"){
                    player_goes_left(scene)
                }
                if (button === "right"){
                    player_goes_right(scene)
                }
            }

            if (player_name === "opponent"){

                if (button === "left"){
                    opponent_goes_left(scene)
                }
                if (button === "right"){
                    opponent_goes_right(scene)
                }
            }
        }
    }



        let timer_text 

        start_match(this, false, false)

        function start_match(scene, you_decided, opponent_decided){
            start_match_timer(scene, you_decided, opponent_decided) 
        }

        function start_match_timer(scene, you_decided, opponent_decided) {
            let countdown = 10;
            timer_text = 'TIMER:' + countdown.toString()
        
            const timerText = scene.add.text(170, 150, timer_text, { 
                fill: '#0f0', 
                fontSize: '30px', 
                strokeThickness: 1, 
                stroke: '#0f0', 
                fontFamily: 'playwritereg', 
                padding: { right: 35 }
            });
        
            const timer = setInterval(() => {
                timerText.setText('TIMER:' + countdown);
                
                if (countdown === 0) {
                    clearInterval(timer);
                  //  console.log("Timer ended. Taking opponent's last decision Add logic here to take the opponent's last decision if timer runs out krishan...");
                }
        
                countdown--;
            }, 1000); 
        }
    
        
        this.score_username = this.add.text(
            10, 150,
            playerName + ' : ' + score_username_fig.toString(),
            { fill: '#0f0', fontSize: '20px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding: { right: 35 } }
        );
        
        this.score_oppenent = this.add.text(
            10, 125,
            opponent_name + ' : ' + score_oppenent_fig.toString(),
            { fill: '#0f0', fontSize: '20px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding: { right: 35 } }
        );

        function update_scores() {
            this.score_username.setText(playerName + ' : ' + score_username_fig.toString());
            this.score_oppenent.setText(opponent_name + ' : ' + score_oppenent_fig.toString());
        }
        
        

        function ball_movement(scene, movement, past) {
            // Define movement presets for different directions
            const movements = {
                top_left_bottom_right: {
                    particle_trail: { x: -450, y: -500 },
                    ball_start: { x: 120, y: 260 },
                    ball_end: { x: 370, y: 560 }
                },
                top_left_bottom_left: {
                    particle_trail: { x: -450, y: -500 },
                    ball_start: { x: 120, y: 260 },
                    ball_end: { x: 120, y: 560 }
                },
                top_right_bottom_right: {
                    particle_trail: { x: -450, y: -500 },
                    ball_start: { x: 370, y: 260 },
                    ball_end: { x: 370, y: 560 }
                },
                top_right_bottom_left: {
                    particle_trail: { x: -450, y: -500 },
                    ball_start: { x: 370, y: 260 },
                    ball_end: { x: 130, y: 560 }
                },
                bottom_left_top_right: {
                    particle_trail: { x: 450, y: 500 },
                    ball_start: { x: 130, y: 560 },
                    ball_end: { x: 370, y: 260 }
                },
                bottom_left_top_left: {
                    particle_trail: { x: 450, y: 500 },
                    ball_start: { x: 130, y: 560 },
                    ball_end: { x: 120, y: 260 }
                },
                bottom_right_top_right: {
                    particle_trail: { x: 450, y: 500 },
                    ball_start: { x: 370, y: 560 },
                    ball_end: { x: 370, y: 260 }
                },
                bottom_right_top_left: {
                    particle_trail: { x: 450, y: 500 },
                    ball_start: { x: 370, y: 560 },
                    ball_end: { x: 120, y: 260 }
                }
            };
        
            // Get the selected movement
            const selectedMovement = movements[movement];
        
            if (!selectedMovement) {
                console.error("Invalid movement direction");
                return;
            }
        
            // Adjust the end position if `past` is "yes" to make the ball move further
            const ballEnd = { ...selectedMovement.ball_end };
            if (past === "yes") {
                const dx = ballEnd.x - selectedMovement.ball_start.x;
                const dy = ballEnd.y - selectedMovement.ball_start.y;
                
                // Extend the end point by an additional 50% in the same direction
                ballEnd.x += dx * 0.5;
                ballEnd.y += dy * 0.5;
            }
        
            // Initialize particle trail and ball positions based on movement direction
            const ball_trail = scene.add.particles(200, 200, "test_particle", {
                speed: 200,
                alpha: 0.5,
                quantity: 1,
                lifespan: 300,
                angle: {
                    min: selectedMovement.particle_trail.x,
                    max: selectedMovement.particle_trail.y
                }
            });
        
            const ball = scene.add.sprite(selectedMovement.ball_start.x, selectedMovement.ball_start.y);
            ball_graphics.fillStyle(0xFFFF00, 1);
            ball_graphics.fillCircle(0, 0, 5);
            ball_graphics.setPosition(ball.x, ball.y);
        
            // Add tween for ball movement
            scene.tweens.add({
                targets: ball_graphics,
                x: ballEnd.x,
                y: ballEnd.y,
                ease: 'Sine.easeInOut',
                duration: 1500,
                yoyo: false,
                repeat: 0,
                onUpdate: function () {
                    ball_trail.x = ball_graphics.x;
                    ball_trail.y = ball_graphics.y;
                },
                onComplete: function () {
                    ball_trail.stop();

                    dict_match["you_decided"] = false
                    dict_match["opponent_decided"] = false
                    
                    if (past === "yes"){
                        match_end(scene)
                    }else{
                        // continue exchange
                        dict_match["ball_possession"] = dict_match["ball_possession"] === "you" ? "opponent" : "you";
                        console.log("end of exchange", dict_match);
                    }

                }
            });
        }


        function match_end(scene){ 
            dict_match["match_ball_possession"] = dict_match["match_ball_possession"] === "you" ? "opponent" : "you";
            dict_match["ball_possession"] = dict_match["match_ball_possession"]
            dict_match["opponent_last_position"] = "left"
            dict_match["you_last_position"] = "right"

            if (dict_match["you_score"] >= 1  || dict_match["opponent_score"] >= 1){ //change to 5

                if (Math.abs(dict_match["you_score"] - dict_match["opponent_score"]) >= 2) {
                    if (dict_match["you_score"] > dict_match["opponent_score"]) {
                        console.log("You are the winner!");
                        runVictory.call(scene)
                    } else {
                        console.log("Your opponent is the winner!");
                        runDefeat.call(scene)
                    }
                }

            }

            if (dict_match["match_ball_possession"] === "you"){
                move_ball(dict_match["match_ball_possession"], "right")

            }

            if (dict_match["match_ball_possession"] === "opponent"){
                move_ball(dict_match["match_ball_possession"], "left")
            }


            if (dict_match["you_position"] != "right"){
                player_goes_right(scene)
                dict_match["you_position"] = "right"
            }

            if (dict_match["opponent_position"] != "left"){
                opponent_goes_left(scene)
                dict_match["opponent_position"] = "left"
            }

            console.log("end of match dict", dict_match);

            

            


            // check if game has ended
            // change scores
            // some other stuff
        }

        function move_sprites(){

        }



        function game_end(){

        }

        function move_ball(player_name, position){

            dict_match["ball_position"] = position
            var ball_x
            var ball_y
            if (player_name === "you"){
                if (position === "left"){
                    ball_x = 115
                    ball_y = 560
                }
                if (position === "right"){
                    ball_x = 370
                    ball_y = 560
                }
            }

            if (player_name === "opponent"){
                if (position === "left"){
                    ball_x = 120
                    ball_y = 260
                }
                if (position === "right"){
                    ball_x = 370
                    ball_y = 260
                }
            }

            // const ball = scene.add.sprite(ball_x, ball_y);
            // ball_graphics.fillStyle(0xFFFF00, 1);
            // ball_graphics.fillCircle(0, 0, 5);
            ball_graphics.setPosition(ball_x, ball_y);
            // ball_graphics.alpha = 1
        }

        var racketcap = this.add.image(250, 425, 'racketcap');
        racketcap.scale = 0.25;
        racketcap.alpha = 0;
        
      
        function spin_racket(scene) {
            var list_who_goes_first = ["you","opponent"];
            var random =  Math.floor((Math.random() * list_who_goes_first.length));
            who_goes_first = list_who_goes_first[random];
            ball_possession = list_who_goes_first[random];
            who_goes_first = "opponent" //krishan delete this
            ball_possession = who_goes_first 

            dict_match["ball_possession"] = ball_possession
            dict_match["match_ball_possession"] = ball_possession

            if (who_goes_first == "you"){
                dict_match["ball_position"] = "right"
            }

            if (who_goes_first == "opponent"){
                dict_match["ball_position"] = "left"
            }

            racketcap.alpha = 0.75;
            var angle = 450;

            if (who_goes_first == "opponent") {
                angle = 270;
            }

            if (who_goes_first == "you") {
                angle = 450;
            }

            scene.tweens.add({
                targets: racketcap,
                angle: angle * 3,
                duration: 2000,
                ease: 'Linear',
                onComplete: () => {
                    create_ball()
                    move_ball(who_goes_first, dict_match["ball_position"])
                    countdown(scene)
                    scene.time.delayedCall(2000, () => { 
                        scene.tweens.add({
                            targets: racketcap,
                            alpha: 0, 
                            duration: 1000, 
                            ease: 'Linear'
                        });
                    });
                }
            });

            return who_goes_first
        }

        game_loop_cpu_start(this)

        function game_loop_cpu_start(scene){
            var position = "left"
            who_goes_first = spin_racket(scene)

            if (who_goes_first === "you"){
                position = "right"
            } 

            if (who_goes_first === "opponent"){
                position = "left"
            } 

            
            
        }

        function countdown(scene) {
            let countdownText = scene.add.text(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY,
                '',
                { fontSize: '64px', fill: '#0f0', fontFamily: 'playwritereg', padding:{right:50},strokeThickness: 4, stroke: '#000000' }
            );
            countdownText.setOrigin(0.35, 0.5);
        
            let countdownNumbers = ['3', '2', '1', 'PLAY!', ''];
            let currentIndex = 0;
        
            scene.time.addEvent({
                delay: 1000,
                repeat: countdownNumbers.length - 1,
                callback: () => {
                    countdownText.setText(countdownNumbers[currentIndex]);
                    currentIndex++;
                },
                onComplete: () => {
                    var esresrf //krishan this is a placeholder
                    
                }
            });
        }
        
        let lastClickTime = 0;
        let clickedOnce = false; // Track if clicked once
        let message; // To hold the temporary message
        
        const backButton = this.add.text(10, 100, 'FORFEIT', { fill: '#0f0', fontSize: '20px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding:{right:50}})
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
                        message = this.add.text(165, 100, 'PRESS AGAIN TO FORFEIT', { fill: 'yellow', fontSize: '20px', fontFamily: 'playwritereg', padding:{right:20}});
        
                        // Hide the message after 2 seconds
                        this.time.delayedCall(2000, () => {
                            message.destroy();
                            clickedOnce = false; // Reset after 2 seconds
                        });
                    }
                }
            });



        const ball_graphics = this.add.graphics();

        function create_ball(){
        //    const ball = scene.add.sprite(ball_x, ball_y);
            ball_graphics.fillStyle(0xFFFF00, 1);
            ball_graphics.fillCircle(0, 0, 5);
            //   ball_graphics.setPosition(ball_x, ball_y);
            ball_graphics.alpha = 1
        }

    

        EventBus.emit('current-scene-ready', this);
    }
}
