<template>
  <aside class="sidebar">
    <h2>Hunar Factory</h2>
    <ul>
      <li>
        <button
          :class="{ active: activeSection === 'stone' }"
          @click="selectSection('stone')"
        >
          Stone
        </button>
      </li>
      <li>
        <button
          :class="{ active: activeSection === 'worker' }"
          @click="selectSection('worker')"
        >
          Worker
        </button>
      </li>
      <li>
        <button
          :class="{ active: activeSection === 'worker-data' }"
          @click="selectSection('worker-data')"
        >
          Worker Data
        </button>
      </li>
      <li>
        <button
          :class="{ active: activeSection === 'helen' }"
          @click="selectSection('helen')"
        >
          Helen
        </button>
      </li>
      <li>
        <button
          :class="{ active: activeSection === 'pallet' }"
          @click="selectSection('pallet')"
        >
          Pallet
        </button>
      </li>
      <li>
        <button
          :class="{ active: activeSection === 'factory-order' }"
          @click="selectSection('factory-order')"
        >
          Factory Orders
        </button>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits(['sectionSelected']);
const props = defineProps({
  activeSection: String, // Receive the active section as a prop from the parent
});

function selectSection(section) {
  emit('sectionSelected', section); // Emit the selected section to the parent
}
</script>
  
  <style scoped>
  /* Sidebar styles */
  .sidebar {
    width: 280px;
    background-color: #2c3e50;
    color: white;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  }
  
  .sidebar h2 {
    color: #ecf0f1;
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 2rem;
    text-align: center;
    border-bottom: 1px solid #1abc9c;
    padding-bottom: 1rem;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar ul li {
    margin-bottom: 20px;
  }
  
  .sidebar ul li button {
    width: 100%;
    background-color: transparent;
    color: white;
    font-size: 1.3rem;
    border: none;
    padding: 10px 20px;
    text-align: left;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    cursor: pointer;
  }
  
  .sidebar ul li button:hover {
    background-color: #1abc9c;
    color: #ecf0f1;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }
  
  .sidebar ul li button.active {
    background-color: #1abc9c;
    color: #ecf0f1;
    font-weight: bold;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }
  </style>
  