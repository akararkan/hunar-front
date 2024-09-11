<template>
  <div class="worker-data-container">
    <h1>Worker Data Management</h1>
    <div class="header">
      <button class="primary-button" @click="openModal">Add Worker Data</button>
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
    <table v-else class="worker-data-table">
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
          <td>{{ data.worker?.fullName }}</td> <!-- Display worker's full name -->
          <td>
            <button class="edit-button" @click="editWorkerData(data)">Edit</button>
            <button class="delete-button" @click="deleteWorkerData(data.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

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
    console.log('Worker Data:', workerDataList.value); // For debugging
  } catch (error) {
    console.error('Error fetching worker data:', error);
  }
}

// Fetch all workers from API
async function fetchWorkers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/worker/allWorkers`);
    workers.value = response.data;
    console.log('Workers:', workers.value); // For debugging
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
</script>


<style scoped>
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
  justify-content: flex-start;
  margin-bottom: 40px;
}

/* Modal styling */
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

/* Table styling */
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

/* Modal form inputs */
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

/* Modal form actions */
.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

/* Button styles */
button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
}

.primary-button {
  background-color: #304eb2;
  color: white;
  transition: background-color 0.3s ease;
}

.primary-button:hover {
  background-color: #27ae60;
  box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);
}

.secondary-button {
  background-color: #95a5a6;
  color: white;
}

.secondary-button:hover {
  background-color: #7f8c8d;
}

/* Edit and Delete Buttons */
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

/* No worker data message */
.no-worker-data {
  margin-top: 50px;
  text-align: center;
  font-size: 1.5em;
  color: #7f8c8d;
}
</style>
