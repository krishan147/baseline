import { Scene } from 'phaser';
import { checkTokenValidity } from './Access.js'
import { signOut } from 'aws-amplify/auth';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { defaultStorage } from 'aws-amplify/utils';
import { runfetchAuthSession } from './Access.js'
import { writeLocally } from './Access.js'
import { readLocally } from './Access.js'

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
        
        await runfetchAuthSession();

        var local_data = readLocally()
        var token = local_data["token"];

        async function signoutCheck(){
            await signOut({ global: true });
          }

          console.log("Preloader.js ", token);
        
        var token_check = await checkTokenValidity(token);
        console.log(token_check);


        if (token_check.valid == false){
            console.log("signing out")
            signoutCheck()
        }

        else if (token_check.valid == true){
            this.scene.start('EnterName');
        }
    }
}
