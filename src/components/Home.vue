<template>
  <div class="home-container">
    <h1>Welcome to the Home Page</h1>
    <div class="button-container">
      <button class="btn-primary" @click="goToFactory()">Factory</button>
      <button class="btn-secondary" @click="goToQuarry()">Quarry</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goToFactory = () =>{
  router.push("/factory")
}
const goToQuarry = () =>{
  router.push("/quarry")

}


</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #e0eafc, #cfdef3);
  font-family: 'Arial', sans-serif;
  text-align: center;
}

h1 {
  color: #2c3e50;
  font-size: 3rem;
  margin-bottom: 20px;
}

p {
  color: #34495e;
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px; /* Space between the buttons */
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  font-size: 1.2rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  outline: none;
}

.btn-primary {
  background-color: #1abc9c;
  color: white;
}

.btn-primary:hover {
  background-color: #16a085;
  transform: scale(1.05);
}

.btn-secondary {
  background-color: #f39c12;
  color: white;
}

.btn-secondary:hover {
  background-color: #e67e22;
  transform: scale(1.05);
}
</style>
