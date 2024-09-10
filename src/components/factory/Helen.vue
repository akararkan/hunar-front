<template>
  <div class="helen-container">
    <h1>Helen Machine Management</h1>
    <div class="header">
      <button class="primary-button" @click="openModal">Add New Helen</button>
    </div>
    <hr />

    <!-- Modal for Adding/Editing a Helen -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editingHelen ? 'Edit Helen' : 'Add New Helen' }}</h3>
        <div class="form-group">
          <input v-model="helen.name" placeholder="Machine Name" class="form-input" />
          <input v-model="helen.type" placeholder="Machine Type" class="form-input" />

          <!-- Worker Dropdown -->
          <label for="worker" class="form-label">Assign Worker</label>
          <select v-model="helen.workerId" id="worker" class="form-input">
            <option value="" disabled>Select Worker</option>
            <option v-for="worker in workers" :key="worker.id" :value="worker.id">
              {{ worker.fullName }}
            </option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="primary-button" @click="saveHelen">{{ editingHelen ? 'Update Helen' : 'Add Helen' }}</button>
          <button class="secondary-button" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Helen Table -->
    <div v-if="helens.length === 0" class="no-helens">
      <p>No helens available. Add a new machine to get started!</p>
    </div>
    <table v-else class="helen-table">
      <thead>
        <tr>
          <th>Machine Name</th>
          <th>Machine Type</th>
          <th>Assigned Worker</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="helen in helens" :key="helen.id">
          <td>{{ helen.name }}</td>
          <td>{{ helen.type }}</td>
          <td>{{ helen.worker?.fullName }}</td>
          <td>
            <button class="edit-button" @click="editHelen(helen)">Edit</button>
            <button class="delete-button" @click="deleteHelen(helen.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const helens = ref([]);
const workers = ref([]);
const helen = ref({
  name: '',
  type: '',
  workerId: '',
});

const editingHelen = ref(null);
const showModal = ref(false);

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Fetch all helens and workers on component mount
onMounted(async () => {
  await fetchHelens();
  await fetchWorkers();
});

// Fetch all helens from API
async function fetchHelens() {
  try {
    const response = await axios.get(`${API_BASE_URL}/helen/getHelens`);
    helens.value = response.data;
  } catch (error) {
    console.error('Error fetching helens:', error);
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

// Add or update helen
async function saveHelen() {
  try {
    if (editingHelen.value) {
      // Update helen
      await axios.put(`${API_BASE_URL}/helen/updateHelenById/${editingHelen.value.id}`, helen.value);
    } else {
      // Add new helen
      const response = await axios.post(`${API_BASE_URL}/helen/addHelen`, helen.value, {
        params: {
          workerId: helen.value.workerId
        }
      });
      helens.value.push(response.data);
    }
    closeModal();
    resetHelen();
  } catch (error) {
    console.error('Error saving helen:', error);
  }
}

// Edit a helen (populate form)
function editHelen(selectedHelen) {
  editingHelen.value = selectedHelen;
  helen.value = { ...selectedHelen, workerId: selectedHelen.worker?.id };
  showModal.value = true;
}

// Delete a helen by ID
async function deleteHelen(id) {
  try {
    await axios.delete(`${API_BASE_URL}/helen/deleteHelenById/${id}`);
    helens.value = helens.value.filter((h) => h.id !== id);
  } catch (error) {
    console.error('Error deleting helen:', error);
  }
}

// Open modal
function openModal() {
  resetHelen();
  showModal.value = true;
}

// Close modal
function closeModal() {
  showModal.value = false;
}

// Reset helen form
function resetHelen() {
  helen.value = {
    name: '',
    type: '',
    workerId: '',
  };
  editingHelen.value = null;
}
</script>

<style scoped>
  /* Helen container styling */
  .helen-container {
    padding: 30px;
    background-color: #f8f9fa;
    min-height: 100vh;
    font-family: 'Roboto', sans-serif;
  }

  /* Title Styling */
  .helen-container h1 {
    text-align: center;
    color: #34495e;
    font-size: 2.8em;
    font-weight: 600;
    margin-bottom: 40px;
  }

  /* Add Helen Button */
  .header {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 40px;
  }

  /* Modal Styling */
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
    position: relative;
    z-index: 100;
  }

  .modal h3 {
    margin-bottom: 20px;
    color: #2c3e50;
    text-align: center;
    font-size: 1.8em;
  }

  /* Table Styling */
  .helen-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .helen-table th, .helen-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  .helen-table th {
    background-color: #34495e;
    color: white;
  }

  .helen-table tr:hover {
    background-color: #f1f1f1;
  }

  /* Modal Form Inputs */
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

  /* Modal Form Actions */
  .modal-actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }

  /* Button Styles */
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

  /* No helens message */
  .no-helens {
    margin-top: 50px;
    text-align: center;
    font-size: 1.5em;
    color: #7f8c8d;
  }
</style>
