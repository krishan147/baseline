<script setup>
import { ref, onMounted, onUnmounted, defineEmits, defineExpose } from 'vue';
import { EventBus } from './EventBus';
import StartGame from './main';

const scene = ref();
const game = ref();

const emit = defineEmits(['current-active-scene']);

onMounted(() => {

    game.value = StartGame('game-container');

    EventBus.on('current-scene-ready', (currentScene) => {

        emit('current-active-scene', currentScene);

        scene.value = currentScene;

    });

});

onUnmounted(() => {

    if (game.value)
    {
        game.value.destroy(true);
        game.value = null;
    }
    
});

defineExpose({ scene, game });
</script>

<template>
    <div id="game-container"></div>
</template>