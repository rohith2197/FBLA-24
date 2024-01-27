<!-- src/App.vue -->

<template>
  <div id="app">
    <div v-if="!showSuccessfulPage" class="container">
      <img src="@/assets/background.png" alt="Background" class="background" />
      <div class="welcome-text">Welcome Back!</div>
      <div class="signin-text">Sign In</div>
      <div class="signin-container">
        <div>
          <input v-model="username" type="text" placeholder="Username" class="input-box" />
          <br />
          <input v-model="password" type="password" placeholder="Password" class="password-box" />
          <br />
          <button @click="displayInputText" class="enter-button">Enter</button>
        </div>
      </div>
    </div>
    <router-view v-if="showSuccessfulPage" />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      inputText: '',
      showSuccessfulPage: false,
    };
  },
  methods: {
    async displayInputText() {
      try {
        const response = await axios.get("/src/authentication.json");

        if (!response.data) {
          throw new Error('Invalid JSON data structure');
        }

        const { username: expectedUsername, password: expectedPassword } = response.data;

        if (this.username === expectedUsername && this.password === expectedPassword) {
          this.showSuccessfulPage = true;
          this.$router.push({ name: 'successful' });
        }
      } catch (error) {
        console.error('Error fetching or parsing JSON file:', error);
      }
    },
  },
};
</script>

<style>
/* Add global styles or adjust existing styles as needed */
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

.container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.signin-container {
  position: absolute;
  top: 62%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
}

.welcome-text {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 6em;
  font-family: 'Rubik', sans-serif;
  font-weight: 550;
  color: #000;
}

.signin-text {
  position: absolute;
  top: 43%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3em;
  font-family: 'Rubik', sans-serif;
  font-weight: 300;
  color: #000;
}

.input-box {
  margin: 10px 0;
  padding: 10px;
  font-size: 1em;
  width: 352px;
  height: 23px;
  color: #000;
  border: 2px solid #000;
  border-radius: 50px;
}

.password-box {
  margin: 10px 0;
  padding: 10px;
  font-size: 1em;
  width: 352px;
  height: 23px;
  color: #000;
  border: 2px solid #000;
  border-radius: 50px;
}

.enter-button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1em;
  width: 375px;
  height: 45px;
  background-color: #a0a0a0;
  color: #000;
  border: none;
  cursor: pointer;
  border-radius: 50px;
  font-weight: 650;
  border: 2px solid #000;
}

.enter-button:hover {
  background-color: #a0a0a0;
}

.enter-button:active {
  background-color: #808080;
}

</style>
