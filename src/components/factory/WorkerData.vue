<template>
  <div class="worker-data-container">
    <h1>Worker Data Management</h1>
    <div class="header">
      <button class="primary-button" @click="openModal">Add Worker Data</button>
      <button class="primary-button print-button" @click="printTable">Print Report</button>
    </div>
    <hr />

    <!-- Modal for Adding/Editing WorkerData -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editingWorkerData ? 'Edit Worker Data' : 'Add Worker Data' }}</h3>
        <div class="form-group">
          <input v-model="workerData.todayCutWeight" placeholder="Today Cut Weight" class="form-input" type="number" />

          <!-- Stone Name Dropdown -->
          <label for="stoneName" class="form-label">Stone Name</label>
          <select v-model="workerData.stoneName" id="stoneName" class="form-input">
            <option value="" disabled>Select Stone Name</option>
            <option value="HAWRAMAN">HAWRAMAN</option>
            <option value="MARBLE">Marble</option>
          </select>

          <!-- Stone Size Dropdown -->
          <label for="stoneSize" class="form-label">Stone Size</label>
          <select v-model="workerData.stoneSize" id="stoneSize" class="form-input">
            <option value="" disabled>Select Stone Size</option>
            <option value="SURFACE3">SURFACE3</option>
            <option value="MEDIUM">Medium</option>
            <option value="LARGE">Large</option>
          </select>

          <input v-model="workerData.todayGainPrice" placeholder="Today Gain Price" class="form-input" type="number" />

          <!-- Worker Dropdown -->
          <label for="worker" class="form-label">Assign Worker</label>
          <select v-model="workerData.workerId" id="worker" class="form-input">
            <option value="" disabled>Select Worker</option>
            <option v-for="worker in workers" :key="worker.id" :value="worker.id">{{ worker.fullName }}</option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="primary-button" @click="saveWorkerData">{{ editingWorkerData ? 'Update' : 'Add' }} Worker Data</button>
          <button class="secondary-button" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- No worker data available message -->
    <div v-if="workerDataList.length === 0" class="no-worker-data">
      <p>No worker data available. Add a new entry to get started!</p>
    </div>

    <!-- Worker Data Table -->
    <table v-else class="worker-data-table" id="workerDataTable">
      <thead>
        <tr>
          <th>Today Cut Weight</th>
          <th>Stone Name</th>
          <th>Stone Size</th>
          <th>Today Gain Price</th>
          <th>Assigned Worker</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in workerDataList" :key="data.id">
          <td>{{ data.todayCutWeight }} kg</td>
          <td>{{ data.stoneName }}</td>
          <td>{{ data.stoneSize }}</td>
          <td>{{ data.todayGainPrice }} USD</td>
          <td>{{ data.worker?.fullName }}</td>
          <td>
            <button class="edit-button" @click="editWorkerData(data)">Edit</button>
            <button class="delete-button" @click="deleteWorkerData(data.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Worker Income Report Section -->
    <div class="report-section">
      <h2>Monthly Income Report</h2>
      
      <!-- Worker Selection -->
      <div class="form-group">
        <label for="workerReport" class="form-label">Select Worker</label>
        <select v-model="selectedWorkerId" id="workerReport" class="form-input" @change="calculateMonthlyIncome">
          <option value="" disabled>Select Worker</option>
          <option v-for="worker in workers" :key="worker.id" :value="worker.id">{{ worker.fullName }}</option>
        </select>
      </div>

      <!-- Display Monthly Income with Cards and Chart -->
      <div v-if="monthlyIncome !== null" class="income-report">
        <!-- Card with worker info -->
        <div class="income-card">
          <p class="total-income">Total Monthly Income: <strong>{{ monthlyIncome }} USD</strong></p>
        </div>

        <!-- Chart for Monthly Income -->
        <div v-if="chartRendered" class="chart-container">
          <canvas id="incomeChart"></canvas>
          <!-- Close button to hide the chart -->
          <button class="secondary-button close-chart" @click="closeChart">Close Chart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'; // Import nextTick to ensure the DOM is updated
import axios from 'axios';
import Chart from 'chart.js/auto'; // Import Chart.js

const workerDataList = ref([]);
const workers = ref([]);
const workerData = ref({
  todayCutWeight: '',
  stoneName: '',
  stoneSize: '',
  todayGainPrice: '',
  workerId: '',
});

const editingWorkerData = ref(null);
const showModal = ref(false);
const selectedWorkerId = ref('');
const monthlyIncome = ref(null);
const chartRendered = ref(false); // Track if the chart is rendered
let incomeChartInstance = null;

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Fetch worker data and workers on component mount
onMounted(async () => {
  await fetchWorkerData();
  await fetchWorkers();
});

// Fetch all worker data with the worker relationship
async function fetchWorkerData() {
  try {
    const response = await axios.get(`${API_BASE_URL}/workerData/allWorkerData`);
    workerDataList.value = response.data;
  } catch (error) {
    console.error('Error fetching worker data:', error);
  }
}

// Fetch all workers from API
async function fetchWorkers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/worker/allWorkers`);
    workers.value = response.data;
  } catch (error) {
    console.error('Error fetching workers:', error);
  }
}

// Save worker data (add or update)
async function saveWorkerData() {
  try {
    if (editingWorkerData.value) {
      // Update existing worker data
      await axios.put(`${API_BASE_URL}/workerData/updateWorkerDataById/${editingWorkerData.value.id}`, workerData.value);
    } else {
      // Add new worker data
      const response = await axios.post(`${API_BASE_URL}/workerData/addWorkerData`, workerData.value, {
        params: {
          workerId: workerData.value.workerId,
        },
      });
      workerDataList.value.push(response.data);
    }
    closeModal();
    resetWorkerData();
  } catch (error) {
    console.error('Error saving worker data:', error);
  }
}

// Edit worker data (populate form)
function editWorkerData(selectedData) {
  editingWorkerData.value = selectedData;
  workerData.value = { ...selectedData, workerId: selectedData.worker?.id };
  showModal.value = true;
}

// Delete worker data by ID
async function deleteWorkerData(id) {
  try {
    await axios.delete(`${API_BASE_URL}/workerData/deleteWorkerDataById/${id}`);
    workerDataList.value = workerDataList.value.filter((data) => data.id !== id);
  } catch (error) {
    console.error('Error deleting worker data:', error);
  }
}

// Open and close modal
function openModal() {
  resetWorkerData();
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

// Reset worker data form
function resetWorkerData() {
  workerData.value = {
    todayCutWeight: '',
    stoneName: '',
    stoneSize: '',
    todayGainPrice: '',
    workerId: '',
  };
  editingWorkerData.value = null;
}

// Print the Worker Data table
function printTable() {
  const printContents = document.getElementById('workerDataTable').outerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // Refresh to reset the view
}

// Calculate the monthly income of a selected worker and display in a chart
function calculateMonthlyIncome() {
  if (selectedWorkerId.value) {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const workerMonthlyData = workerDataList.value.filter((data) => {
      const recordDate = new Date(data.createDate);
      return (
        data.worker?.id === selectedWorkerId.value &&
        recordDate.getMonth() + 1 === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    });

    const totalIncome = workerMonthlyData.reduce((sum, data) => sum + data.todayGainPrice, 0);
    monthlyIncome.value = totalIncome;

    const dailyIncome = calculateDailyIncome(workerMonthlyData);

    // Ensure the canvas is rendered before updating the chart
    nextTick(() => {
      updateIncomeChart(dailyIncome);
    });

    chartRendered.value = true;
  } else {
    monthlyIncome.value = null;
    chartRendered.value = false; // Hide chart if no worker selected
  }
}

// Helper function to calculate daily income for the chart
function calculateDailyIncome(workerMonthlyData) {
  const dailyIncomeMap = {};

  workerMonthlyData.forEach((data) => {
    const dateKey = new Date(data.createDate).toLocaleDateString();
    if (!dailyIncomeMap[dateKey]) {
      dailyIncomeMap[dateKey] = 0;
    }
    dailyIncomeMap[dateKey] += data.todayGainPrice;
  });

  const dates = Object.keys(dailyIncomeMap);
  const incomes = Object.values(dailyIncomeMap);

  return { dates, incomes };
}

// Initialize or update the Chart.js chart
function updateIncomeChart(dailyIncome) {
  const ctx = document.getElementById('incomeChart');

  if (ctx) {
    if (incomeChartInstance) {
      incomeChartInstance.destroy(); // Destroy the existing chart instance to avoid duplicates
    }

    incomeChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dailyIncome.dates,
        datasets: [
          {
            label: 'Daily Income (USD)',
            data: dailyIncome.incomes,
            backgroundColor: '#16a085',
            borderColor: '#1abc9c',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

// Function to close the chart
function closeChart() {
  chartRendered.value = false;
  if (incomeChartInstance) {
    incomeChartInstance.destroy(); // Destroy the chart when closing
    incomeChartInstance = null;
  }
}
</script>

<style scoped>
/* Styles remain the same as before */
.worker-data-container {
  padding: 30px;
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
}

.worker-data-container h1 {
  text-align: center;
  color: #34495e;
  font-size: 2.8em;
  font-weight: 600;
  margin-bottom: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: #fff;
  padding: 30px;
  border-radius: 16px;
  width: 550px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal h3 {
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
  font-size: 1.8em;
}

.worker-data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.worker-data-table th, .worker-data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.worker-data-table th {
  background-color: #34495e;
  color: white;
}

.worker-data-table tr:hover {
  background-color: #f1f1f1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-input {
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
  font-size: 1.1em;
  width: 100%;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-button {
  background-color: #1abc9c;
  color: white;
  font-size: 1.2em;
  padding: 15px 30px;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.primary-button:hover {
  background-color: #16a085;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(22, 160, 133, 0.4);
}

.secondary-button {
  background-color: #e74c3c;
  color: white;
}

.secondary-button:hover {
  background-color: #c0392b;
}

.close-chart {
  margin-top: 20px;
  display: block;
  background-color: #e74c3c;
  color: white;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
}

.edit-button, .delete-button {
  padding: 8px 16px;
  font-size: 1em;
  font-weight: bold;
  border-radius: 8px;
}

.edit-button {
  background-color: #3498db;
  color: white;
}

.edit-button:hover {
  background-color: #2980b9;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
}

.delete-button:hover {
  background-color: #c0392b;
}

.no-worker-data {
  margin-top: 50px;
  text-align: center;
  font-size: 1.5em;
  color: #7f8c8d;
}

.print-button {
  background-color: #3498db;
  color: white;
  font-size: 1.2em;
  padding: 15px 30px;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.print-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
}

.report-section {
  margin-top: 40px;
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.1);
}

.report-section h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
  text-align: center;
}

.income-report {
  margin-top: 20px;
  font-size: 1.2em;
  color: #2c3e50;
  font-weight: bold;
  text-align: center;
}

.income-card {
  margin-top: 20px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.worker-name {
  font-size: 1.5em;
  font-weight: bold;
  color: #2c3e50;
}

.total-income {
  font-size: 1.3em;
  margin-top: 10px;
  color: #16a085;
}

canvas {
  margin-top: 20px;
  width: 100%;
  height: 300px;
}
</style>
