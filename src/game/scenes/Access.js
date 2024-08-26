import { fetchAuthSession } from 'aws-amplify/auth';

var gameDataString = localStorage.getItem('myGameData');
var gameData = JSON.parse(gameDataString);


async function runfetchAuthSession(){

    const session = await fetchAuthSession({ forceRefresh: true });
    const idToken = session.tokens.idToken.toString();

    gameData["token"] = idToken;
    var gameDataString = JSON.stringify(gameData);
    localStorage.setItem('myGameData', gameDataString);

    return idToken

}

async function checkTokenValidity() {

    var idToken = gameData["token"]

    return idToken

}

async function refreshToken() {


}

function getTokenLocally(){
    var idToken = gameData["token"]
    return idToken
}

var ido = getTokenLocally()
console.log(ido)


export async function getPlayer(playerName){

    const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/usernametable?playerName=' + playerName;

    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': getTokenLocally()
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            console.log("no username found");
            return "no username found";
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

}

export async function postPlayer(playerData) {
    try { 
        const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/usernametable';
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': getTokenLocally() 
        };

        const body = {
            "playerId": playerData.playerId,
            "gold_cpu": 1000,
            "gold_cpu_date_issue": 1720683935,
            "gold_multi": 1000,
            "gold_multi_date_issue": 1720683935,
            "gold_multi_real": 1000,
            "playerName": playerData.playerName,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return 'Username created';
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function patchPlayer(emailAddress){

}

export async function getGame(data){

}

export async function postGame(data){

}

export async function patchGame(data){

}