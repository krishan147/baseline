<template>
  <authenticator
    :hideSignUp="true"
    :formFields="customFormFields"
    :social-providers="['apple', 'google']"
    v-if="!isTokenValid"
  >
    <template v-slot="{ user }">
      <div v-if="user">
        <component :is="AppMain" />
      </div>
      <div v-else>
        <p>No user authenticated</p>
      </div>
    </template>

    <template v-slot:sign-in-header>
      <h1>BASELINE</h1>
      <h2>TURN-BASED TENNIS FOR WINNERS</h2>
    </template>
  </authenticator>


</template>

<script setup>
import { ref, watch } from 'vue';
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import { Amplify } from 'aws-amplify';
import outputs from './amplifyconfiguration.json';
import AppMain from '@/AppMain.vue';
import jwtDecode from "jwt-decode";
import { signOut } from 'aws-amplify/auth';

Amplify.configure(outputs);

const customFormFields = {
  signIn: {
    username: {
      labelHidden: true,
      isRequired: false,
      type: 'hidden'
    },
    password: {
      labelHidden: true,
      isRequired: false,
      type: 'hidden'
    }
  }
};

const isTokenValid = ref(false);

// const checkTokenValid = async () => {
//   try {
//     const gameDataString = localStorage.getItem('myGameData');
//     if (!gameDataString) {
//       return false;
//     }

//     const gameData = JSON.parse(gameDataString);
//     const idToken = gameData?.token;

//     if (!idToken) {
//       return false;
//     }

//     const decodedToken = jwtDecode(idToken);
//     const currentTime = Date.now() / 1000;

//     return decodedToken.exp > currentTime;
//   } catch (error) {
//       signoutCheck()
//     return false;
//   }
// };

// checkTokenValid().then(valid => {
//   isTokenValid.value = valid;
// });

// if (!isTokenValid.value) {
//   signoutCheck()
// }

// async function signoutCheck(){
//   await signOut({ global: true });
// }

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
  background-color: rgb(0, 255, 0);
  border: 0px solid rgb(0, 255, 0);
}

.amplify-text {
  color: black;
}

form[data-amplify-form] {
  background-color: #000;
  color: #fff;
  padding: 20px;
}

[data-amplify-router-content] {
  background-color: #000;
  color: #000;
}

h1 {
  color: rgb(0, 255, 0);
  font-family: 'playwritereg';
  opacity: 0;
  animation: fadeIn 2s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

h2 {
  color: rgb(0, 255, 0);
  font-family: 'playwritereg';
  font-size: 15px;
  opacity: 0;
  animation: fadeIn 2s forwards;
}
</style>
