<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="email">Email:</label>
          <input v-model="user.email" type="email" id="email" placeholder="Enter your email" required />
        </div>
        <div class="input-group">
          <label for="password">Password:</label>
          <input v-model="user.password" type="password" id="password" placeholder="Enter your password" required />
        </div>
        <button type="submit" :disabled="!user.email || !user.password">Login</button>
      </form>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const user = ref({
  email: '',
  password: ''
});

const errorMessage = ref(null);

const login = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/v1/user/login', user.value);
    const token = response.data.token;

    // Decode JWT token
    const decodedToken = jwtDecode(token);

    // Store token in localStorage
    localStorage.setItem('authToken', token);

    console.log('Logged in user:', decodedToken);

    // Redirect to home page
    window.location.href = '/home'; // or this.$router.push('/home') if using Vue Router
  } catch (error) {
    errorMessage.value = 'Login failed. Please check your credentials.';
  }
};
</script>

<style scoped>
/* General container styling */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #74ebd5, #acb6e5); /* Soft gradient background */
  font-family: 'Roboto', sans-serif;
}

/* Login box styling */
.login-box {
  background-color: white;
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Hover effect for login box */
.login-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

/* Header styling */
h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 30px;
  letter-spacing: 1.5px;
  font-weight: bold;
}

/* Input group styling */
.input-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

/* Input field styling */
input {
  width: 100%;
  padding: 12px;
  margin-bottom: 5px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

/* Focus effect for inputs */
input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.2);
}

/* Button styling */
button {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:disabled {
  background-color: #a0c4e5;
}

button:hover:not(:disabled) {
  background-color: #2980b9;
  transform: scale(1.02);
}

button:active:not(:disabled) {
  background-color: #2471a3;
}

/* Error message styling */
.error {
  color: red;
  margin-top: 15px;
  font-size: 0.9rem;
}

/* Mobile responsive design */
@media (max-width: 400px) {
  .login-box {
    width: 100%;
    padding: 30px;
    margin: 0 20px;
  }

  h1 {
    font-size: 2rem;
  }

  button {
    font-size: 1rem;
  }
}
</style>
