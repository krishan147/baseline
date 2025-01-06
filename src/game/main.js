import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Play } from './scenes/Play';
import { Menu } from './scenes/Menu';
import { Preloader } from './scenes/Preloader';
import { Options } from './scenes/Options';
import { Richest } from './scenes/Richest';
import { EnterName } from './scenes/EnterName';
import { PlayOnline } from './scenes/PlayOnline';
import { Bet } from './scenes/Bet';
import { Bank } from './scenes/Bank';
import { Wait } from './scenes/Wait';
import { Nomatch } from './scenes/Nomatch';

const desktopConfig = {
    type: Phaser.AUTO,
    width: 489, 
    height: 900, 
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
    },
    input: {
        activePointers: 1,
        touch: true,
    },
    scene: [
        Boot,
        Preloader,
        Play,
        PlayOnline,
        Menu,
        Options,
        Richest,
        EnterName,
        Bet,
        Bank,
        Wait,
        Nomatch,
    ],
    dom: {
        createContainer: true,
    },
};

const game = new Phaser.Game(desktopConfig);



window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

export default function StartGame(parent) {
    return new Phaser.Game({ ...desktopConfig, parent });
}
 