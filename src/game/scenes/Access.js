import { fetchAuthSession } from 'aws-amplify/auth';

async function runfetchAuthSession(){

    const session = await fetchAuthSession()
    const idToken = session.tokens.idToken.toString();
    return idToken

}

//const idToken = runfetchAuthSession()

//console.log(idToken);


export async function getPlayer(playerName){

}

export async function postPlayer(gameData) {

}

export async function patchPlayer(playerName){

}

export async function getGame(data){

}

export async function postGame(data){

}

export async function patchGame(data){

}