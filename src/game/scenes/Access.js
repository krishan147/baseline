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
    email: "test@gmail.com",
    online_bet:0,
    offline_bet:0,
    game_type:"offline play"
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
            return originalGameData;
        }
    } else {
        var originalGameData = resetGameLocally();
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

    const { idToken } = await getToken()

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
           // return "no data found";
           return readLocally();
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


export async function patch_player(playerId, updateKey, updateValue) {

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

function create_unique_id() {
    return Math.random().toString().slice(2) + Date.now().toString() + Math.random().toString().slice(2);
}

let multiplayer_player_id
let playerData
let tries = 0

export async function post_game(playerDataPromise, bet) {
    try {
        playerData = await playerDataPromise;
        const { idToken } = await getToken();

        multiplayer_player_id = create_unique_id();

        playerData["id"] = multiplayer_player_id;
        playerData["bet"] = bet;
        playerData["game"] = "finding_game";
        playerData["datetime"] = new Date().toISOString();
        playerData["against_player_name"] = "";
        playerData["against_player_id"] = "";
        playerData["session_id"] = "";
        playerData["tries"] = 0;
        playerData["entered_game"] = 0;

        const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/lookingforgame';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        };

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out after 60 seconds')), 60000);
        });

        const response = await Promise.race([
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(playerData)
            }),
            timeoutPromise
        ]);

        const responseData = await response.json();

        if (!response.ok) {
            return `Error here: ${response.statusText}`;
        }

        return responseData;

    } catch (error) {
        console.error('Error here:', error);
        return `Error here: ${error.message}`;
    }
}


export async function get_game(){

    const { idToken } = await getToken()
    
    const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/lookingforgame?multiplayer_player_id=' + playerData['id'];

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

        let playerData_string = JSON.stringify(data);
        localStorage.setItem('playerData', playerData_string);
    
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } 
}

let session_id

export async function get_game_w_session_id(){

    const { idToken } = await getToken()

    playerData = localStorage.getItem('playerData');
    playerData = JSON.parse(playerData);

    session_id = playerData['session_id']
    
    const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/lookingforgame?session_id=' + session_id

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

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } 
}


export async function get_play(session_id){

    const { idToken } = await getToken()

    playerData = localStorage.getItem('playerData');
    playerData = JSON.parse(playerData);

    session_id = playerData['session_id']
    
    const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/lookingforgame?type=play&session_id=' + session_id;

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

        console.log(data);

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } 
}

export async function post_play(dict_match){
    try {

        const { idToken } = await getToken();

        const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/lookingforgame?type=play';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        };

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out after 20 seconds')), 20000);
        });

        const response = await Promise.race([
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dict_match)
            }),
            timeoutPromise
        ]);

        const responseData = await response.json();

        if (!response.ok) {
            return `Error here: ${response.statusText}`;
        }

        console.log("access.js responseData", responseData);

        return responseData;

    } catch (error) {
        console.error('Error here:', error);
        return `Error here: ${error.message}`;
    }
}

export async function does_game_exist(){

    console.log("running does game exist")

}