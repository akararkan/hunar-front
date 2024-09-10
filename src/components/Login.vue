<template>
    <div class="login-container">
      <div class="login-box">
        <h1>Login</h1>
        <form @submit.prevent="login">
          <div class="input-group">
            <label for="username">Username</label>
            <input type="text" v-model="username" required placeholder="Enter your username" />
          </div>
          <div class="input-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" required placeholder="Enter your password" />
          </div>
          <button type="submit" :disabled="loading">{{ loading ? 'Logging in...' : 'Login' }}</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios' // Axios for making HTTP requests
  
  const username = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const loading = ref(false) // Loading state
  const router = useRouter()
  
  // Replace this URL with your actual API endpoint
  const apiUrl = 'http://localhost:8080/api/v1/user/login'
  
  const login = async () => {
    errorMessage.value = '' // Clear previous errors
    loading.value = true // Set loading state
  
    try {
      const response = await axios.post(apiUrl, {
        username: username.value,
        password: password.value
      })
  
      // Check if we received the token
      if (response.data && response.data.token) {
        const token = response.data.token
  
        // Save the token to localStorage (or sessionStorage)
        localStorage.setItem('authToken', token)
  
        // Redirect to home page after successful login
        router.push({ name: 'Home' })
      } else {
        // If no token was returned, show an error
        errorMessage.value = 'Login failed. No token received.'
      }
    } catch (error) {
      // Handle error (e.g., incorrect credentials)
      if (error.response && error.response.status === 401) {
        errorMessage.value = 'Invalid credentials. Please try again.'
      } else {
        errorMessage.value = 'An error occurred during login. Please try again.'
      }
    } finally {
      loading.value = false // Reset loading state
    }
  }
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
  