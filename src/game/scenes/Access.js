import { fetchAuthSession } from 'aws-amplify/auth';
import { jwtDecode } from "jwt-decode"
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { KeyValueStorageInterface } from 'aws-amplify/utils';
  


const originalGameData = {
    playerId: 123,
    playerName: "Player1",
    mute: false,
    volume: 100,
    gold_cpu_date_issue: 1720683935,
    gold_multi_date_issue: 1720683935,
    gold_cpu: 1000,
    gold_multi: 1000,
    gold_multi_real: 1000,
    email: "test@gmail.com"
};

const tokenGameData = {
    token: "zzzz",
    email: "test@gmail.com"
};

export async function getToken() {
    try {
        const session = await fetchAuthSession({ forceRefresh: true });
        const idToken = session.tokens.idToken.toString();
        const decodedToken = jwtDecode(idToken);
        const email = decodedToken.email;
        
        var gameData = await readLocally();
        gameData['email'] = email;

        var gameDataString = JSON.stringify(gameData);
        localStorage.setItem('myGameData', gameDataString);

        var tokenData = await readTokenLocally()
        tokenData["email"] = email;
        tokenData["token"] = idToken;
        var tokenDataString = JSON.stringify(tokenData);
        localStorage.setItem('tokenData', tokenDataString);

        console.log("getToken ", gameData)
        console.log("getToken ", tokenData)
    
        return { idToken, email };
    } catch (error) {
        console.log("Access.js ", error);
        return null; 
    }
}

export async function readLocally() {
    let gameDataString = localStorage.getItem('myGameData');
    if (gameDataString) {
        try {
            var gameData = JSON.parse(gameDataString);
            // Check if gameData is missing keys, if so, reset to originalGameData
            if (!gameData || Object.keys(gameData).length !== Object.keys(originalGameData).length) {
                gameData = { ...originalGameData };
                writeLocally(gameData); // Persist the corrected gameData
            }
            return gameData;
        } catch (error) {
            console.error("Error parsing gameData from localStorage:", error);
            return originalGameData; // Fall back to default if error occurs
        }
    } else {
        resetLocally();
        return originalGameData;
    }
}


export async function readTokenLocally() {
    let tokenDataExists = localStorage.getItem('tokenGameData') !== null;

    if (tokenDataExists) {
        var tokenDataString = localStorage.getItem('tokenGameData');
        var tokenData = JSON.parse(tokenDataString);
        return tokenData;
    } else {
        resetTokenLocally();
        return tokenData; 
    }
}


export async function resetTokenLocally() {
    localStorage.removeItem('tokenGameData');
    let tokenDataString = JSON.stringify(tokenGameData);
    localStorage.setItem('tokenGameData', tokenDataString);
    return tokenGameData;
}


export async function writeLocally(new_data){
    var gameDataString = JSON.stringify(new_data);
    localStorage.setItem('myGameData', gameDataString);
}


export async function checkTokenValidity(token) {
    
    try {
        var idToken = token;
    }
    catch (error){
        return {error}
    }

    if (!idToken) {
        return { valid: false, reason: 'No token provided' };
    }

    try {
        const decodedToken = jwtDecode(idToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
            return { valid: true };
        } else {
            return { valid: false, reason: 'Token has expired' };
        }
    } catch (error) {
        return { valid: false, reason: 'Token decoding failed', error };
    }
}

export async function getPlayer(playerName){

    const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/usernametable?playerName=' + playerName;

    const headers = {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${readTokenLocally()}`
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
    console.log(readTokenLocally());

    const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/usernametable?email=' + email;

    const headers = {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${readTokenLocally()}`
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            return "no data found";
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

}

export async function postPlayer(playerDataPromise) {

    try {
        const playerData = await playerDataPromise;

        const idToken = await readTokenLocally() 

        console.log(idToken);
        console.log(playerData);

        const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/usernametable';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(playerData)
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
            'Authorization': `Bearer ${readTokenLocally()}`
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


export async function resetLocally() {
    localStorage.removeItem('myGameData');
    let gameDataString = JSON.stringify(originalGameData);
    localStorage.setItem('myGameData', gameDataString);
    return originalGameData;
}





export async function getGame(data){

}

export async function postGame(data){

}

export async function patchGame(data){

}

