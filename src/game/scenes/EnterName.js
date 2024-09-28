import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { audioButton } from './Options.js';
import { getPlayer } from './Access.js'
import { postPlayer } from './Access.js'
// import { getToken } from './Access.js'
// import { getPlayerWithEmail } from './Access.js'
import { writeLocally } from './Access.js'
import { readLocally } from './Access.js'


const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class EnterName extends Scene {
    constructor() {
        super('EnterName');
    }
    
    preload() {
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
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
        this.load.image('grass', 'spritesheet/grass.png');
    }

    async create() {

        var volume = 100;
        var isChecked = 0;
        
    //     try {
    //         var gameData = await readLocally()
    //         var volume = gameData["volume"];
    //         var isChecked = gameData["mute"];

    //         if (gameData["playerName"] === "Player1" || gameData["playerName"] === undefined) {
    //             var data = getPlayerWithEmail()
    //             console.log("EnterName.js, locally name is Player1/undefined")
    //         }else {
    //             this.scene.start('Menu');
    //         }
    // } catch(error){
    //     volume = 100;
    //     isChecked = 0;
    //     console.log(error)
    // }

        this.cameras.main.setBackgroundColor(0x000000);

        const title = this.add.text(50, 110, 'BASELINE', { fill: '#0f0', fontSize: '240px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding: { right: 35} })
            .setInteractive()
            .on('pointerdown', () => {
                title.setStyle({ fill: '#ffff00' });
                window.open('http://krishgames.com', '_blank');
                setTimeout(() => {
                    title.setStyle({ fill: '#0f0' });
                }, 200);
                audioButton(isChecked);
            });

        const krishgames = this.add.text(50, 190, 'BY KRISHGAMES', { fill: '#0f0', fontSize: '20px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg' })
            .setInteractive()
            .on('pointerdown', () => {
                krishgames.setStyle({ fill: '#ffff00' });
                window.open('http://krishgames.com', '_blank');
                setTimeout(() => {
                    krishgames.setStyle({ fill: '#0f0' });
                }, 200);
                audioButton(isChecked);
            }).setAlpha(0);

        this.tweens.add({
            targets: title,
            scaleX: 0.25, // Scale down to 50% (since it started at double size, this makes it normal size)
            scaleY: 0.25, // Scale down to 50%
            ease: 'Power1', // You can use different easing functions
            duration: 1000, // Duration of the tween in milliseconds
            onComplete: () => {
                // Optional: Change the font size after the tween completes
                title.setFontSize('240px'); // Set to the target size
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

        const grassImages = [];
        const startX = 0; // Starting X position
        const startY = 250; // Starting Y position
        const gapX = 35; // Horizontal gap between images
        const gapY = 45; // Vertical gap between images
  
        for (let row = 0; row < 6; row++) { // 6 rows (vertical repeat)
          for (let col = 0; col < 16; col++) { // 7 columns (horizontal repeat)
            const x = startX + col * gapX;
            const y = startY + row * gapY;
            const grassImage = this.add.image(x, y, 'grass');
            grassImage.alpha = 0;
            grassImage.setTint(0x00FF00);
            grassImages.push(grassImage);
          }
        }

        let botSprite = this.add.sprite(270, 360, anim_to_run).setAlpha(0);
        botSprite.setTint(0x00FF00);
        botSprite.play(anim_to_run);

        var inputText = this.add.rexInputText(240, 530, 500, 50, {
            type: 'text', // Single-line input
            placeholder: 'ENTER YOUR USERNAME', // Placeholder text
            fontSize: '30px', // Adjusted for better visibility
            color: '#00ff00', // Green text
            backgroundColor: '#000000',
            border: '1px solid #0f0',
            align: 'center',
            fontFamily: 'playwritereg',
            style: {
                textTransform: 'uppercase' // Ensures entered text is in uppercase
            }
        }).setAlpha(0);

        // Optional: Style the placeholder text
        inputText.node.style.setProperty('placeholder', '#555555'); // Placeholder color

        // Capture input in username variable when submit is clicked
        var username = '';

        const messageSpaces = this.add.text(10, 610, 'ENTER ALPHANUMERIC \n CHARACTERS', { fill: '#0f0', fontSize: '30px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding: { right: 35} }).setAlpha(0)
        const messageLonger = this.add.text(10, 610, 'ENTER 4 TO 20 \n CHARACTERS', { fill: '#0f0', fontSize: '30px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding: { right: 35} }).setAlpha(0)
        const messageObscenity = this.add.text(10, 610, 'NO OBSCENITY', { fill: '#0f0', fontSize: '30px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding: { right: 35} }).setAlpha(0)
        const messagePunctuation = this.add.text(10, 610, 'NO PUNCTUATION', { fill: '#0f0', fontSize: '30px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding: { right: 35} }).setAlpha(0)
        const messageExists = this.add.text(10, 610, 'NAME ALREADY EXISTS', { fill: '#0f0', fontSize: '30px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg', padding: { right: 35} }).setAlpha(0)

        function generateRandomId() {
            let randomId = Math.floor(Math.random() * 1e12);
            return randomId;
        }

        async function handleSubmit() {
            username = inputText.text.toUpperCase(); // Capture input text as uppercase
            let trimmed_username = username.trim();

            var list_profanity = ["2G1C",
            "2 GIRLS 1 CUP",
            "ACROTOMOPHILIA",
            "ALABAMA HOT POCKET",
            "ALASKAN PIPELINE",
            "ANAL",
            "ANILINGUS",
            "ANUS",
            "APESHIT",
            "ARSEHOLE",
            "ASS",
            "ASSHOLE",
            "ASSMUNCH",
            "AUTO EROTIC",
            "AUTOEROTIC",
            "BABELAND",
            "BABY BATTER",
            "BABY JUICE",
            "BALL GAG",
            "BALL GRAVY",
            "BALL KICKING",
            "BALL LICKING",
            "BALL SACK",
            "BALL SUCKING",
            "BANGBROS",
            "BANGBUS",
            "BAREBACK",
            "BARELY LEGAL",
            "BARENAKED",
            "BASTARD",
            "BASTARDO",
            "BASTINADO",
            "BBW",
            "BDSM",
            "BEANER",
            "BEANERS",
            "BEAVER CLEAVER",
            "BEAVER LIPS",
            "BEASTIALITY",
            "BESTIALITY",
            "BIG BLACK",
            "BIG BREASTS",
            "BIG KNOCKERS",
            "BIG TITS",
            "BIMBOS",
            "BIRDLOCK",
            "BITCH",
            "BITCHES",
            "BLACK COCK",
            "BLONDE ACTION",
            "BLONDE ON BLONDE ACTION",
            "BLOWJOB",
            "BLOW JOB",
            "BLOW YOUR LOAD",
            "BLUE WAFFLE",
            "BLUMPKIN",
            "BOLLOCKS",
            "BONDAGE",
            "BONER",
            "BOOB",
            "BOOBS",
            "BOOTY CALL",
            "BROWN SHOWERS",
            "BRUNETTE ACTION",
            "BUKKAKE",
            "BULLDYKE",
            "BULLET VIBE",
            "BULLSHIT",
            "BUNG HOLE",
            "BUNGHOLE",
            "BUSTY",
            "BUTT",
            "BUTTCHEEKS",
            "BUTTHOLE",
            "CAMEL TOE",
            "CAMGIRL",
            "CAMSLUT",
            "CAMWHORE",
            "CARPET MUNCHER",
            "CARPETMUNCHER",
            "CHOCOLATE ROSEBUDS",
            "CIALIS",
            "CIRCLEJERK",
            "CLEVELAND STEAMER",
            "CLIT",
            "CLITORIS",
            "CLOVER CLAMPS",
            "CLUSTERFUCK",
            "COCK",
            "COCKS",
            "COPROLAGNIA",
            "COPROPHILIA",
            "CORNHOLE",
            "COON",
            "COONS",
            "CREAMPIE",
            "CUM",
            "CUMMING",
            "CUMSHOT",
            "CUMSHOTS",
            "CUNNILINGUS",
            "CUNT",
            "DARKIE",
            "DATE RAPE",
            "DATERAPE",
            "DEEP THROAT",
            "DEEPTHROAT",
            "DENDROPHILIA",
            "DICK",
            "DILDO",
            "DINGLEBERRY",
            "DINGLEBERRIES",
            "DIRTY PILLOWS",
            "DIRTY SANCHEZ",
            "DOGGIE STYLE",
            "DOGGIESTYLE",
            "DOGGY STYLE",
            "DOGGYSTYLE",
            "DOG STYLE",
            "DOLCETT",
            "DOMINATION",
            "DOMINATRIX",
            "DOMMES",
            "DONKEY PUNCH",
            "DOUBLE DONG",
            "DOUBLE PENETRATION",
            "DP ACTION",
            "DRY HUMP",
            "DVDA",
            "EAT MY ASS",
            "ECCHI",
            "EJACULATION",
            "EROTIC",
            "EROTISM",
            "ESCORT",
            "EUNUCH",
            "FAG",
            "FAGGOT",
            "FECAL",
            "FELCH",
            "FELLATIO",
            "FELTCH",
            "FEMALE SQUIRTING",
            "FEMDOM",
            "FIGGING",
            "FINGERBANG",
            "FINGERING",
            "FISTING",
            "FOOT FETISH",
            "FOOTJOB",
            "FROTTING",
            "FUCK",
            "FUCK BUTTONS",
            "FUCKIN",
            "FUCKING",
            "FUCKTARDS",
            "FUDGE PACKER",
            "FUDGEPACKER",
            "FUTANARI",
            "GANGBANG",
            "GANG BANG",
            "GAY SEX",
            "GENITALS",
            "GIANT COCK",
            "GIRL ON",
            "GIRL ON TOP",
            "GIRLS GONE WILD",
            "GOATCX",
            "GOATSE",
            "GOD DAMN",
            "GOKKUN",
            "GOLDEN SHOWER",
            "GOODPOOP",
            "GOO GIRL",
            "GOREGASM",
            "GROPE",
            "GROUP SEX",
            "G-SPOT",
            "GURO",
            "HAND JOB",
            "HANDJOB",
            "HARD CORE",
            "HARDCORE",
            "HENTAI",
            "HOMOEROTIC",
            "HONKEY",
            "HOOKER",
            "HORNY",
            "HOT CARL",
            "HOT CHICK",
            "HOW TO KILL",
            "HOW TO MURDER",
            "HUGE FAT",
            "HUMPING",
            "INCEST",
            "INTERCOURSE",
            "JACK OFF",
            "JAIL BAIT",
            "JAILBAIT",
            "JELLY DONUT",
            "JERK OFF",
            "JIGABOO",
            "JIGGABOO",
            "JIGGERBOO",
            "JIZZ",
            "JUGGS",
            "KIKE",
            "KINBAKU",
            "KINKSTER",
            "KINKY",
            "KNOBBING",
            "LEATHER RESTRAINT",
            "LEATHER STRAIGHT JACKET",
            "LEMON PARTY",
            "LIVESEX",
            "LOLITA",
            "LOVEMAKING",
            "MAKE ME COME",
            "MALE SQUIRTING",
            "MASTURBATE",
            "MASTURBATING",
            "MASTURBATION",
            "MENAGE A TROIS",
            "MILF",
            "MISSIONARY POSITION",
            "MONG",
            "MOTHERFUCKER",
            "MOUND OF VENUS",
            "MR HANDS",
            "MUFF DIVER",
            "MUFFDIVING",
            "NAMBLA",
            "NAWASHI",
            "NEGRO",
            "NEONAZI",
            "NIGGA",
            "NIGGER",
            "NIG NOG",
            "NIMPHOMANIA",
            "NIPPLE",
            "NIPPLES",
            "NSFW",
            "NSFW IMAGES",
            "NUDE",
            "NUDITY",
            "NUTTEN",
            "NYMPHO",
            "NYMPHOMANIA",
            "OCTOPUSSY",
            "OMORASHI",
            "ONE CUP TWO GIRLS",
            "ONE GUY ONE JAR",
            "ORGASM",
            "ORGY",
            "PAEDOPHILE",
            "PAKI",
            "PANTIES",
            "PANTY",
            "PEDOBEAR",
            "PEDOPHILE",
            "PEGGING",
            "PENIS",
            "PHONE SEX",
            "PIECE OF SHIT",
            "PIKEY",
            "PISSING",
            "PISS PIG",
            "PISSPIG",
            "PLAYBOY",
            "PLEASURE CHEST",
            "POLE SMOKER",
            "PONYPLAY",
            "POOF",
            "POON",
            "POONTANG",
            "PUNANY",
            "POOP CHUTE",
            "POOPCHUTE",
            "PORN",
            "PORNO",
            "PORNOGRAPHY",
            "PRINCE ALBERT PIERCING",
            "PTHC",
            "PUBES",
            "PUSSY",
            "QUEAF",
            "QUEEF",
            "QUIM",
            "RAGHEAD",
            "RAGING BONER",
            "RAPE",
            "RAPING",
            "RAPIST",
            "RECTUM",
            "REVERSE COWGIRL",
            "RIMJOB",
            "RIMMING",
            "ROSY PALM",
            "ROSY PALM AND HER 5 SISTERS",
            "RUSTY TROMBONE",
            "SADISM",
            "SANTORUM",
            "SCAT",
            "SCHLONG",
            "SCISSORING",
            "SEMEN",
            "SEX",
            "SEXCAM",
            "SEXO",
            "SEXY",
            "SEXUAL",
            "SEXUALLY",
            "SEXUALITY",
            "SHAVED BEAVER",
            "SHAVED PUSSY",
            "SHEMALE",
            "SHIBARI",
            "SHIT",
            "SHITBLIMP",
            "SHITTY",
            "SHOTA",
            "SHRIMPING",
            "SKEET",
            "SLANTEYE",
            "SLUT",
            "S&M",
            "SMUT",
            "SNATCH",
            "SNOWBALLING",
            "SODOMIZE",
            "SODOMY",
            "SPASTIC",
            "SPIC",
            "SPLOOGE",
            "SPLOOGE MOOSE",
            "SPOOGE",
            "SPREAD LEGS",
            "SPUNK",
            "STRAP ON",
            "STRAPON",
            "STRAPPADO",
            "STRIP CLUB",
            "STYLE DOGGY",
            "SUCK",
            "SUCKS",
            "SUICIDE GIRLS",
            "SULTRY WOMEN",
            "SWASTIKA",
            "SWINGER",
            "TAINTED LOVE",
            "TASTE MY",
            "TEA BAGGING",
            "THREESOME",
            "THROATING",
            "THUMBZILLA",
            "TIED UP",
            "TIGHT WHITE",
            "TIT",
            "TITS",
            "TITTIES",
            "TITTY",
            "TONGUE IN A",
            "TOPLESS",
            "TOSSER",
            "TOWELHEAD",
            "TRANNY",
            "TRIBADISM",
            "TUB GIRL",
            "TUBGIRL",
            "TUSHY",
            "TWAT",
            "TWINK",
            "TWINKIE",
            "TWO GIRLS ONE CUP",
            "UNDRESSING",
            "UPSKIRT",
            "URETHRA PLAY",
            "UROPHILIA",
            "VAGINA",
            "VENUS MOUND",
            "VIAGRA",
            "VIBRATOR",
            "VIOLET WAND",
            "VORAREPHILIA",
            "VOYEUR",
            "VOYEURWEB",
            "VOYUER",
            "VULVA",
            "WANK",
            "WETBACK",
            "WET DREAM",
            "WHITE POWER",
            "WHORE",
            "WORLDSEX",
            "WRAPPING MEN",
            "WRINKLED STARFISH",
            "XX",
            "XXX",
            "YAOI",
            "YELLOW SHOWERS",
            "YIFFY",
            "ZOOPHILIA",
            "🖕"                           
            ]

            if (list_profanity.some(rejectWord => username.includes(rejectWord))) {
                showMessageObscenity.call(this);
            } else if (trimmed_username === "") {
                showMessageSpaces.call(this);
            } else if (username.length < 4 || username.length > 20) {
                showMessageLonger.call(this);
            } else if (/[^a-zA-Z0-9_-]/.test(username)) {
                showMessagePunctuation.call(this);
            } else if (await getPlayer(username) != "no username found") {
                showMessageExists.call(this);
            } else {
                var playerId = generateRandomId.call(this)
                var gameData = await readLocally()
                gameData["playerName"] = username;
                gameData["playerId"] = playerId;

                audioButton(isChecked);
                submitButton.setStyle({ fill: '#ffff00' });
                this.scene.start('Menu');
                await writeLocally(gameData);
                await postPlayer(gameData);

            }
        }

        // Create the submit button and add the click handler
        const submitButton = this.add.text(10, 560, 'SUBMIT', {
            fill: '#0f0',
            fontSize: '30px',
            strokeThickness: 1,
            stroke: '#0f0',
            fontFamily: 'playwritereg',
            padding: { right: 35 }
        })
        .setInteractive()
        .on('pointerdown', handleSubmit.bind(this))
        .setAlpha(0);

        this.input.keyboard.on('keydown-ENTER', handleSubmit.bind(this));

        EventBus.emit('current-scene-ready', this);

        this.tweens.add({
            targets: [krishgames, inputText, submitButton, botSprite],    
            alpha: 1,               
            duration: 6000,        
            ease: 'Power2',    
            onComplete: function() {
            }
        });

        this.tweens.add({
            targets: grassImages,    
            alpha: 1,               
            duration: 2000,        
            ease: 'Power2',    
            onComplete: function() {
            }
        });

        function showMessageExists() {
            // Tween to fade in the text
            this.tweens.add({
                targets: messageExists,
                alpha: 1,
                duration: 200,
                onComplete: () => {
                    // After a delay of 5 seconds, fade out the text
                    this.time.delayedCall(1000, () => {
                        this.tweens.add({
                            targets: messageExists,
                            alpha: 0,
                            duration: 200
                        });
                    });
                }
            });
        }

        function showMessagePunctuation() {
            // Tween to fade in the text
            this.tweens.add({
                targets: messagePunctuation,
                alpha: 1,
                duration: 200,
                onComplete: () => {
                    // After a delay of 5 seconds, fade out the text
                    this.time.delayedCall(1000, () => {
                        this.tweens.add({
                            targets: messagePunctuation,
                            alpha: 0,
                            duration: 200
                        });
                    });
                }
            });
        }

        function showMessageObscenity() {
            // Tween to fade in the text
            this.tweens.add({
                targets: messageObscenity,
                alpha: 1,
                duration: 200,
                onComplete: () => {
                    // After a delay of 5 seconds, fade out the text
                    this.time.delayedCall(1000, () => {
                        this.tweens.add({
                            targets: messageObscenity,
                            alpha: 0,
                            duration: 200
                        });
                    });
                }
            });
        }

        function showMessageSpaces() {
            // Tween to fade in the text
            this.tweens.add({
                targets: messageSpaces,
                alpha: 1,
                duration: 200,
                onComplete: () => {
                    // After a delay of 5 seconds, fade out the text
                    this.time.delayedCall(1000, () => {
                        this.tweens.add({
                            targets: messageSpaces,
                            alpha: 0,
                            duration: 200
                        });
                    });
                }
            });
        }

        function showMessageLonger() {
            // Tween to fade in the text
            this.tweens.add({
                targets: messageLonger,
                alpha: 1,
                duration: 200,
                onComplete: () => {
                    // After a delay of 5 seconds, fade out the text
                    this.time.delayedCall(1000, () => {
                        this.tweens.add({
                            targets: messageLonger,
                            alpha: 0,
                            duration: 200
                        });
                    });
                }
            });
        }

        // // Adding event listeners for focus and blur to the input field
        // inputText.node.addEventListener('focus', handleFocus);
        // inputText.node.addEventListener('blur', handleBlur);

        // function handleFocus() {
        //     // Prevent body scrolling
        //     document.body.style.overflow = 'hidden';
        //     // Prevent Phaser container from scrolling
        //     // this.scale.parent.style.overflow = 'hidden';
        // }

        // function handleBlur() {
        //     // Allow body scrolling
        //     document.body.style.overflow = 'auto';
        //     // Allow Phaser container scrolling if needed
        //     this.scale.parent.style.overflow = 'auto';
        // }
    }

    update() {}
}
