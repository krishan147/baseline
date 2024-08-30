import { fetchAuthSession } from 'aws-amplify/auth';
import { jwtDecode } from "jwt-decode"

var gameDataString = localStorage.getItem('myGameData');
var gameData = JSON.parse(gameDataString);


export async function runfetchAuthSession(){

    const session = await fetchAuthSession({ forceRefresh: true });
    const idToken = session.tokens.idToken.toString();

    const decodedToken = jwtDecode(idToken);
    const email = decodedToken.email;

    gameData["token"] = idToken;
    gameData["email"] = email;
    var gameDataString = JSON.stringify(gameData);
    localStorage.setItem('myGameData', gameDataString);

    return idToken

}



export async function checkTokenValidity() {
    console.log("heyhey");
    var idToken = gameData["token"];

    if (!idToken) {
        return { valid: false, reason: 'No token provided' };
    }

    try {
        const decodedToken = jwtDecode(idToken);
        const currentTime = Date.now() / 1000; // Current time in seconds

        if (decodedToken.exp > currentTime) {
            return { valid: true };
        } else {
            return { valid: false, reason: 'Token has expired' };
        }
    } catch (error) {
        return { valid: false, reason: 'Token decoding failed', error };
    }
}




async function refreshToken() {


}

function getTokenLocally(){
    var idToken = gameData["token"]
    return idToken
}

export async function getPlayer(playerName){
    console.log(getTokenLocally());

    const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/usernametable?playerName=' + playerName;

    const headers = {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${getTokenLocally()}`
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


export async function getPlayerWithEmail(email){
    console.log(getTokenLocally());

    const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/usernametable?email=' + email;

    const headers = {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${getTokenLocally()}`
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

// var ddd = getPlayer("Player1")
// console.log(ddd);

export async function postPlayer(playerData) {
    var idToken = await runfetchAuthSession()

    console.log(idToken);

    console.log("playerData")
    console.log(playerData)

    var playerData_drop = playerData;
    delete playerData_drop.token;

    try {
        const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/usernametable';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(playerData_drop)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return 'Username created';
    } catch (error) {
        console.error('Error here:', error);
        throw error;
    }
}

// var playerData = {
//     playerId:9992323324,
//     playerName: "asddev",
//     mute: false,
//     volume: 5,
//     gold_cpu_date_issue:1720683935,
//     gold_multi_date_issue:1720683935,
//     gold_cpu:1000,
//     gold_multi:1000,
//     gold_multi_real:1000,
//     token:"dfg",
//     email:"ggg@gmail.com"
// };
// var ddd = postPlayer(playerData)
// console.log(ddd);

export async function patchPlayer(playerId, updateKey, updateValue) {
    const playerData = {
        playerId: playerId,
        updateKey: updateKey,
        updateValue: updateValue
    };

    try {
        const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/usernametable';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getTokenLocally()}`
        };

        const response = await fetch(url, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(playerData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Return the response body if needed
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getGame(data){

}

export async function postGame(data){

}

export async function patchGame(data){

}