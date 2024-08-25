<template>
  <authenticator
    :hideSignUp="true"
    :formFields="customFormFields"
    :social-providers="['apple', 'google']"
    :hideSignIn="true"
  >
    <template v-slot="{ user }">
      <div v-if="user">
        <component :is="AppMain" />
      </div>
      <div v-else>
      </div>
    </template>
  </authenticator>
</template>

<script setup>
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
// import { Amplify, Auth } from 'aws-amplify';
import { Amplify } from 'aws-amplify';
import outputs from './amplifyconfiguration.json';
import AppMain from '@/AppMain.vue';
import { ref, watch } from 'vue';

Amplify.configure(outputs);

const customFormFields = {
  signIn: {
    username: {
      labelHidden: true,
      placeholder: 'Enter Email',
      order: 1,
      isRequired: false,
      type: 'hidden'
    },
    password: {
      labelHidden: true,
      placeholder: 'Enter Password',
      order: 2,
      isRequired: false,
      type: 'hidden'
    }
  }
};

// const getAccessToken = async () => {

//   var gameDataString = localStorage.getItem('myGameData');
//   var gameData = JSON.parse(gameDataString);

//   try {
//     const session = await Auth.currentSession();
//     const accessToken = session.getAccessToken().getJwtToken();
//     console.log('Access Token:', accessToken);

//     gameData["token"] = accessToken;
//     var gameDataStringToken = JSON.stringify(gameData);
//     localStorage.setItem('myGameData', gameDataStringToken);

//     console.log(gameData);

//     return accessToken;
//   } catch (error) {
    

//     gameData["token"] = "failed";
//     var gameDataStringTokenFailed = JSON.stringify(gameData);
//     localStorage.setItem('myGameData', gameDataStringTokenFailed);

//     console.log(gameData);

//     console.error('Error getting access token:', error);

//     return null;
//   }

// };

// const user = ref(null);

// watch(
//   user,
//   async (newUser) => {
//     if (newUser) {
//       const token = await getAccessToken();
//       // Use the access token as needed
//     }
//   }
// );
</script>

<style>
.amplify-button--primary {
  display: none;
}

.amplify-button--link.amplify-button--small[data-amplify-button] {
  display: none;
}

.amplify-divider.amplify-divider--horizontal.amplify-divider--small {
  display: none;
}

button.amplify-button {
  background-color: rgb(0, 255, 0); /* Dark gray background for buttons */
  border: 0px solid  rgb(0, 255, 0)
}

.amplify-text {
  color:black;
}

form[data-amplify-form] {
  background-color: #000; /* Black background */
  color: #fff; /* White text color for contrast */
  padding: 20px; /* Optional: add padding for better spacing */
}

[data-amplify-router-content] {
  background-color: #000; 
  color: #000; 
}
</style>
