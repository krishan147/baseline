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

    <template v-slot:header>
      <h1>BREAKPOINT</h1>
      <h2>TURN-BASED TENNIS FOR WINNERS</h2>
    </template>

    <template v-slot:footer>
      <h3>By signing in, you consent to the following <a href="https://krishgames.com/privacyPolicy.html" style="color: yellow;">terms & conditions + privacy policy</a> which describes the rules and conditions that apply to you when playing the game. We value being transparent about how we collect and use your persoanl data. Thanks!</h3>
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


form[data-amplify-form] {

}

[data-amplify-router-content] {
  background-color: #000;
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

h3 {
  color: rgb(0, 255, 0);
  font-family: 'playwritereg';
  font-size: 11px;
  opacity: 0;
  animation: fadeIn 2s forwards;
}
</style>
