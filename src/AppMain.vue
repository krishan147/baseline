<script setup>
import Phaser from 'phaser';
import { ref } from 'vue';
import PhaserGame from './game/PhaserGame.vue';

const canMoveSprite = ref();
const phaserRef = ref();

const currentScene = (scene) => {

    // canMoveSprite.value = (scene.scene.key !== 'MainMenu');
    canMoveSprite.value = (scene.scene.key !== 'EnterName');

}
</script>

<template>


    <div>
        <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
    </div>
    
</template>
