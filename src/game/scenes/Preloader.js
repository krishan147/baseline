import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

    }

    preload ()
    {
        this.load.setPath('assets');

        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        })
    }

    create ()
    {

        let gameDataExists = localStorage.getItem('myGameData') !== null;

        if (gameDataExists) {
            console.log("Game data exists in localStorage.");            
        } else {
            console.log("No game data found in localStorage.");
            resetGame()
        }
        
        function resetGame() {
            localStorage.removeItem('myGameData');
            var gameData = {
                playerId:123,
                playerName: "Player1",
                mute: false,
                volume: 0.5,
                gold_cpu_date_issue:1720683935,
                gold_multi_date_issue:1720683935,
                gold_cpu:1000,
                gold_multi:1000,
                gold_multi_real:1000,
                token:"zzzz",
                email:"test@gmail.com"
            };
            let gameDataString = JSON.stringify(gameData);
            localStorage.setItem('myGameData', gameDataString);
        }

        var gameDataString = localStorage.getItem('myGameData');
        var gameData = JSON.parse(gameDataString);
        var playerName = gameData["playerName"];

        if (playerName == "Player1"){
            this.scene.start('EnterName');
        } else {
            this.scene.start('Menu');
        }
    }
}
