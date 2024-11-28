import { Scene } from 'phaser';
import { checkTokenValidity } from './Access.js'
import { signOut } from 'aws-amplify/auth';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { defaultStorage } from 'aws-amplify/utils';
import { getToken } from './Access.js'
import { writeLocally } from './Access.js'
import { readLocally } from './Access.js'
import { resetGameLocally } from './Access.js'
import { getPlayerWithEmail } from './Access.js'

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
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

    async create ()
    {
        cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);

        async function signOutCheck(){
            resetGameLocally()
            await signOut({ global: true });
          }

        const result = await getToken();

        if (result) {
            var { idToken } = result;
            console.log("Preloader.js Token obtained");
        } else {
            console.log("Failed to fetch session");
        }


        var token_check = await checkTokenValidity(idToken);

        console.log("token check", token_check);

        if (token_check.valid == false){
            console.log("signing out")
            signOutCheck()
        }

        else if (token_check.valid == true){

            var gameData = await readLocally()

            var email = gameData["email"]
            var data = await getPlayerWithEmail(email)

            await writeLocally(data);

            if (data["playerName"] === "Player1" || data["playerName"] === undefined) {
                this.scene.start('EnterName');
            }else {
                this.scene.start('Play');          //Menu      
            }

        }
    }
}
