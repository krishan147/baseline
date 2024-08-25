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

const config = {
    type: Phaser.AUTO,
    width: 489, // Design width 489
    height: 900, // Design height 870
    parent: 'game-container',
    // backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
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
        Bet
    ],
    dom: {
        createContainer: true
    },
};

// Initialize the game and attach it to the 'game-container'
const game = new Phaser.Game(config);

// Handle window resize
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

export default function StartGame(parent) {
    return new Phaser.Game({ ...config, parent });
}
