







export async function getPlayer(playerName){
    // const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/usernametable?playerName=' + playerName;

    // const sound = await getSound();

    // const headers = {
    //     'Content-Type': 'application/json',
    //     'x-api-key': sound
    // };

    // try {
    //     const response = await fetch(url, {
    //         method: 'GET',
    //         headers: headers
    //     });

    //     if (!response.ok) {
    //         console.log("no username found");
    //         return "no username found";
    //     }

    //     const data = await response.json();
    //     return data;
    // } catch (error) {
    //     console.error('Error:', error);
    //     throw error;
    // }
}




export async function postPlayer(gameData) {
    // try { 
    //     const url = 'https://dpnpfzxvnk.execute-api.eu-west-1.amazonaws.com/production/usernametable';
    //     const headers = {
    //         'Content-Type': 'application/json',
    //         'x-api-key': await getSound() 
    //     };

    //     const body = {
    //         "playerId": gameData.playerId,
    //         "gold_cpu": 1000,
    //         "gold_cpu_date_issue": 1720683935,
    //         "gold_multi": 1000,
    //         "gold_multi_date_issue": 1720683935,
    //         "gold_multi_real": 1000,
    //         "playerName": gameData.playerName,
    //     };

    //     const response = await fetch(url, {
    //         method: 'POST',
    //         headers: headers,
    //         body: JSON.stringify(body)
    //     });

    //     if (!response.ok) {
    //         throw new Error('Network response was not ok ' + response.statusText);
    //     }
    //     return 'Username created';
    // } catch (error) {
    //     console.error('Error:', error);
    //     throw error;
    // }
}