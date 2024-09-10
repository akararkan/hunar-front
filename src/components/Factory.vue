<template>
  <div class="app-layout">
    <Sidebar :activeSection="currentSection" @sectionSelected="currentSection = $event" />
    <main class="main-content">
      <component :is="getComponent(currentSection)" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Sidebar from './Sidebar.vue';

// Import the components you want to display
import Stone from './factory/Stone.vue';
import Helen from './factory/Helen.vue';
import FactoryOrder from './factory/FactoryOrder.vue';
import Worker from './factory/Worker.vue';
import WorkerData from './factory/WorkerData.vue';
import Pallet from './factory/Pallet.vue';

// Load the saved section from localStorage or default to 'stone'
const currentSection = ref(localStorage.getItem('currentSection') || 'stone');

// Watch the currentSection and save it to localStorage whenever it changes
watch(currentSection, (newSection) => {
  localStorage.setItem('currentSection', newSection);
});

// Function to get the component based on the selected section
function getComponent(section) {
  switch (section) {
    case 'stone':
      return Stone;
    case 'factory-order':
      return FactoryOrder;
    case 'helen':
      return Helen;
    case 'pallet':
      return Pallet;
    case 'worker':
      return Worker;
    case 'worker-data':
      return WorkerData;
    default:
      return Stone;
  }
}
</script>


<style scoped>
.app-layout {
  display: flex;
  height: 100vh; /* Full viewport height */
  overflow: hidden; /* Prevent overflow on the main layout */
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #ffffff;
  height: 100vh; /* Full height for the main content */
  overflow-y: auto; /* Enable vertical scrolling */
  box-sizing: border-box; /* Include padding in the height calculation */
}
</style>
