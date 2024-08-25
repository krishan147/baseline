import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { audioButton } from './Options.js';
// import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
// import { CognitoIdentityProvider, AdminCreateUserCommand, paginateListUserPools } from "@aws-sdk/client-cognito-identity-provider";
// import { CognitoUserPool, CognitoUserAttribute } from "amazon-cognito-identity-js";

// import { Authenticator } from "@aws-amplify/ui-vue"; //krishan this works whats next?
// //import { fetchAuthSession } from 'aws-amplify/auth'

// import { signInWithRedirect, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
// import { Hub } from 'aws-amplify/utils';

// import { Amplify } from 'aws-amplify';
// import amplifyConfig from '../amplifyconfiguration.json';
// Amplify.configure(amplifyConfig);



export class Richest extends Scene {
    constructor() {
        super('Richest');
    }

    preload() {}

    create() {
        // Retrieve game data




        const gameDataString = localStorage.getItem('myGameData');
        const gameData = JSON.parse(gameDataString);
        const volume = gameData["volume"];
        const isChecked = gameData["mute"];

        this.cameras.main.setBackgroundColor(0x000000);

        const title = this.add.text(50, 110, 'RICH LIST', { fill: '#0f0', fontSize: '60px' ,strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg',padding: { right: 35}}).setAlpha(0);

        const richTitle = this.add.text(150, 400, 'RICHEST', { fill: '#0f0', fontSize: '30px', strokeThickness: 1, stroke: '#0f0', fontFamily: 'playwritereg' });

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
        this.tweens.add({
            targets: [title],    
            alpha: 1,               
            duration: 2000,        
            ease: 'Power2',    
            onComplete: function() {
            }
        });
        



        EventBus.emit('current-scene-ready', this);
        
        // const poolData = {
        //     UserPoolId: 'eu-west-1_RTWsq57ym',
        //     ClientId: '7to2vt1a6g3kv86tm49q20u81k'
        // }

        // const userPool = new CognitoUserPool(poolData);

        // const attributeList = [
        //     new CognitoUserAttribute({
        //         Name: 'email',
        //         Value: 'byebyeqq@yahoo.com'
        //     })
        // ];
        
        // const signUpUser = (email, password) => {
        //     userPool.signUp(email, password, attributeList, null, (err, result) => {
        //         if (err) {
        //             console.error(err.message || JSON.stringify(err));
        //             return;
        //         }
        //         console.log('User name is ' + result.user.getUsername());
        //         console.log('Call result: ' + result);
        //     });
        // };
    
    //signUpUser('byebyeqq@yahoo.com', 'passwordtestAAA1$');

      // Uncaught (in promise) AuthUserPoolException: Auth UserPool not configured. krishan need secrets stored somewhere locally?





        // const cognitoCreateUser = async () => {
        //     try {
        //         const params = {
        //             UserPoolId: 'eu-west-1_RTWsq57ym',
        //             Username: 'testest',
        //             EMAIL: ["testest@gmail.com"],
        //         };
        //         const command = new AdminCreateUserCommand(params);
        //         return client.send(command);
        //     } catch (err) {
        //         throw err;
        //     }
        // }

        // cognitoCreateUser()



        // const helloCognito = async () => {
        //     const paginator = paginateListUserPools({ client }, {});
          
        //     const userPoolNames = [];
          
        //     for await (const page of paginator) {
        //       const names = page.UserPools.map((pool) => pool.Name);
        //       userPoolNames.push(...names);
        //     }
          
        //     console.log("User pool names: ");
        //     console.log(userPoolNames.join("\n"));
        //     return userPoolNames;
        //   };


        //   helloCognito()




        // Amplify.configure({
        //     Auth: {
        //         userPoolId: 'eu-west-1_RTWsq57ym',
        //         userPoolWebClientId: '7to2vt1a6g3kv86tm49q20u81k',
        //         oauth: {
        //             domain: 'your_cognito_domain.auth.eu-west-1.amazoncognito.com',
        //             scope: ['email', 'profile', 'openid'],
        //             redirectSignIn: 'http://localhost:3000/',
        //             redirectSignOut: 'http://localhost:3000/',
        //             responseType: 'code'
        //         }
        //     }
        // });


        // const awsConfig = {
        //     Auth: {
        //         region: 'eu-west-1',
        //         userPoolId: 'eu-west-1_RTWsq57ym',
        //         userPoolWebClientId: '7to2vt1a6g3kv86tm49q20u81k',
        //         oauth: {
        //             domain: 'your_cognito_domain.auth.eu-west-1.amazoncognito.com',
        //             scope: ['email', 'openid', 'profile'],
        //             redirectSignIn: 'http://localhost:8080/callback',
        //             redirectSignOut: 'http://localhost:8080/',
        //             responseType: 'code'
        //         }
        //     }
        // };
        
        // Amplify.configure(awsconfig);
       

 

    }

    

}
