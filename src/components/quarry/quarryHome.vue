<template>
  <div class="home-page">
    <div class="stats-container">
      <!-- Number of Quarries -->
      <div class="stat-card quarries-card">
        <div class="stat-icon">
          <i class="icon-mountain"></i>
        </div>
        <div class="stat-content">
          <h3>Total Quarries</h3>
          <p>{{ quarriesCount }}</p>
        </div>
      </div>

      <!-- Number of Quarry Workers -->
      <div class="stat-card workers-card">
        <div class="stat-icon">
          <i class="icon-users"></i>
        </div>
        <div class="stat-content">
          <h3>Total Workers</h3>
          <p>{{ workersCount }}</p>
        </div>
      </div>

      <!-- Number of Orders -->
      <div class="stat-card orders-card">
        <div class="stat-icon">
          <i class="icon-clipboard"></i>
        </div>
        <div class="stat-content">
          <h3>Total Orders</h3>
          <p>{{ ordersCount }}</p>
        </div>
      </div>

      <!-- Number of Packages -->
      <div class="stat-card packages-card">
        <div class="stat-icon">
          <i class="icon-package"></i>
        </div>
        <div class="stat-content">
          <h3>Total Packages</h3>
          <p>{{ packagesCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Define reactive variables to store the lists and calculate their length
const quarriesCount = ref(0);
const workersCount = ref(0);
const ordersCount = ref(0);
const packagesCount = ref(0);

// Fetch the lists from the backend when the component is mounted
onMounted(async () => {
  try {
    const [quarriesRes, workersRes, ordersRes, packagesRes] = await Promise.all([
      axios.get('http://localhost:8080/api/v1/quarry/allQuarries'),       // Fetch list of quarries
      axios.get('http://localhost:8080/api/v1/quarry-workers/allWorkers'), // Fetch list of workers
      axios.get('http://localhost:8080/api/v1/quarry-orders/allOrders'),   // Fetch list of orders
      axios.get('http://localhost:8080/api/v1/quarry-packages/allPackages')// Fetch list of packages
    ]);

    // Assign the length of the returned lists to the count variables
    quarriesCount.value = quarriesRes.data.length;
    workersCount.value = workersRes.data.length;
    ordersCount.value = ordersRes.data.length;
    packagesCount.value = packagesRes.data.length;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
</script>

<style scoped>
/* General Home Page Styles */
.home-page {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9fafb; /* Light background for better contrast */
  min-height: 100vh;
}

/* Grid Container for Stats */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); /* Adjust to fit more cards */
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin-top: 2rem;
}

/* Stat Card Styles */
.stat-card {
  background: linear-gradient(135deg, #3b82f6, #1e3a8a);
  color: white;
  border-radius: 15px; /* Softer, rounded corners */
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15); /* Slightly deeper shadow for a modern look */
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer; /* Add cursor to indicate interactivity */
}

/* Hover Effect on Cards */
.stat-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

/* Stat Icon Styles */
.stat-icon {
  font-size: 3rem;
  opacity: 0.85; /* Increase opacity for better visibility */
  margin-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Stat Content Styles */
.stat-content h3 {
  font-size: 1.4rem; /* Slightly larger for better readability */
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.stat-content p {
  font-size: 2.5rem; /* Larger font for the numbers */
  font-weight: bold;
  margin: 0.75rem 0 0;
}

/* Individual Color Schemes */
.quarries-card {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.workers-card {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.orders-card {
  background: linear-gradient(135deg, #f97316, #f59e0b);
}

.packages-card {
  background: linear-gradient(135deg, #9333ea, #a855f7);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  .stat-icon {
    margin-bottom: 1.5rem;
  }
}

</style>
