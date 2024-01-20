<!-- src/App.vue -->

<template>
  <div id="app">
    <!-- Your main app content goes here -->
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
          <div v-if="inputText">
            <p>Entered Text: {{ inputText }}</p>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
// import * as Authentication from '/Users/rohithpallamreddy/Documents/GitHub/FBLA-24/Authentication.js';
// import {checkCredentials} from '/Users/rohithpallamreddy/Documents/GitHub/FBLA-24/Authentication.js';
export default {
  data() {
    return {
      username: '',
      password: '',
      inputText: '', // To store the entered text
    };
  },
  methods: {
    displayInputText() {
      // Combine the username and password and store it in inputText
      // this.inputText = 'Username: ' + Authentication.checkCredentials(this.username, this.password);
      // this.inputText = `Username: ${this.username}, Password: ${this.password}`;
      this.buttonClicked = !this.buttonClicked;
      // Reset buttonClicked after a short delay to allow for repeated clicks
      setTimeout(() => {
        this.buttonClicked = false;
      }, 300);
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure the image covers the entire background */
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
  font-family: 'Rubik', sans-serif; /* Use Rubik font */
  font-weight: 550;
  color: #000;
}

.signin-text {
  position: absolute;
  top: 43%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3em;
  font-family: 'Rubik', sans-serif; /* Use Rubik font */
  font-weight: 300;
  color: #000;
}

.input-box {
  margin: 10px 0;
  padding: 10px;
  font-size: 1em;
  width: 352px;
  height: 23px;
  color: #000; /* Set the text color to black */
  border: 2px solid #000; /* Add a border */
  border-radius: 50px; /* Add rounded corners */
  transition: transform 0.3s ease;
}

.password-box {
  margin: 10px 0;
  padding: 10px;
  font-size: 1em;
  width: 352px;
  height: 23px;
  color: #000; /* Set the text color to black */
  border: 2px solid #000; /* Add a border */
  border-radius: 50px; /* Add rounded corners */
  transition: transform 0.3s ease;
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
  border: 2px solid #000; /* Add a border */
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.enter-button:hover {
  background-color: #a0a0a0; /* Change background color on hover */
  transform: scale(0.95);
}

.enter-button:active {
  background-color: #808080; /* Change background color when button is clicked */
  transform: scale(0.9); /* Apply a shrink effect */
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-45px);
  }
  50% {
    transform: translateX(45px);
  }
  75% {
    transform: translateX(-45px);
  }
}
</style>
