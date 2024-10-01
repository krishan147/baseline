import { fetchAuthSession } from 'aws-amplify/auth';
import { jwtDecode } from "jwt-decode"
import { getCurrentUser } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';

const originalGameData = {
    playerId: 123,
    playerName: "Player1",
    mute: false,
    volume: 10,
    gold_cpu_date_issue: 1720683935,
    gold_multi_date_issue: 1720683935,
    gold_cpu: 1000,
    gold_multi: 1000,
    gold_multi_real: 1000,
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
        localStorage.setItem('gameData', gameDataString);
    
        return { idToken, email };
    } catch (error) {
        console.log("Access.js ", error);
        return null; 
    }
}



export async function readLocally() {
    let gameDataString = localStorage.getItem('gameData');
    if (gameDataString) {
        try {
            var gameData = JSON.parse(gameDataString);
            writeLocally(gameData);
            return gameData;
        } catch (error) {
            console.error("Error parsing gameData from localStorage:", error);
            return originalGameData;
        }
    } else {
        resetGameLocally();
        return originalGameData;
    }
}


export async function writeLocally(new_data){
    var gameDataString = JSON.stringify(new_data);
    localStorage.setItem('gameData', gameDataString);
}


export async function resetGameLocally() {
    localStorage.removeItem('gameData');
    let gameDataString = JSON.stringify(originalGameData);
    localStorage.setItem('gameData', gameDataString);
    return originalGameData;
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

    const { idToken } = getToken()

    const headers = {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${idToken}`
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
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

    const { idToken } = await getToken()

    const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/usernametable?email=' + email;

    const headers = {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${idToken}`
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
        writeLocally(data);

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
    
}


export async function postPlayer(playerDataPromise) {

    try {
        const playerData = await playerDataPromise;

        const { idToken } = await getToken()


        if (!playerData || !playerData.volume) {
            console.error('playerData is null or volume is undefined.');
        } else{
            console.log("not null")
        }

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
            throw new Error('Network response was not good ' + response.statusText);
        }

        return 'Username created';
    } catch (error) {
        console.error('Error here:', error);
        throw error;
    }
}

export async function patchPlayer(playerId, updateKey, updateValue) {

    const { idToken } = await getToken()

    const playerData = {
        playerId: playerId,
        updateKey: updateKey,
        updateValue: updateValue
    };

    try {
        const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/usernametable';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
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

export async function lookingForGame(playerDataPromise){
    try {
        const playerData = await playerDataPromise;
        const { idToken } = await getToken()


        if (!playerData || !playerData.volume) {
            console.error('playerData is null or volume is undefined.');
        } else{
            console.log("not null")
        }
        
        playerData["id"] = 'er3432rwe34r'
        playerData["bet"] = 1000
        playerData["try"] = 0
        playerData["game"] = "finding_game"
        playerData["datetime"] = "2024-02-01 16:05:01"

        console.log(playerData)

        const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/lookingforgame';
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
            throw new Error('Network response was not good ' + response.statusText);
        }

        return 'lookingforgame run';
    } catch (error) {
        console.error('Error here:', error);
        throw error;
    }
}


export async function matchGames() {


    try {
 
        const { idToken } = await getToken();

        const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/lookingforgame?' + 
                    'playerName=ddtest&playerId=fewr3rfdsf&try=0&bet=1000&game=finding_game';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        };

        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

    console.log(response.json());
    
    return response


    } catch (error){
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

