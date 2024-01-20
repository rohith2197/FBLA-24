<!-- src/App.vue -->

<template>
    <div id="app">
      <IntroScreen />
    </div>
  </template>
  
  <script>
  import IntroScreen from './components/IntroScreen.vue';
  
  export default {
    components: {
      IntroScreen,
    },
  };
  </script>
  
  <style>
  body {
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(to bottom, #3498db, #1f2c3d);
  }
  </style>
  