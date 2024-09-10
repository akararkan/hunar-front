<template>
    <div class="worker-container">
      <h1>Worker Management</h1>
      <div class="header">
        <button class="primary-button" @click="openModal">Add New Worker</button>
      </div>
      <hr />
  
      <!-- Modal for Adding/Editing a Worker -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <h3>{{ editingWorker ? 'Edit Worker' : 'Add New Worker' }}</h3>
          <div class="form-group">
            <input v-model="worker.fullName" placeholder="Full Name" class="form-input" />
            <input v-model="worker.phoneNumber" placeholder="Phone Number" class="form-input" />
            <input v-model="worker.email" placeholder="Email" class="form-input" />
            <input v-model="worker.address" placeholder="Address" class="form-input" />
            <input v-model="worker.nationality" placeholder="Nationality" class="form-input" />
            <label for="gender" class="form-label">Gender</label>
            <select v-model="worker.gender" id="gender" class="form-input">
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <label for="workerType" class="form-label">Worker Type</label>
            <select v-model="worker.workerType" id="workerType" class="form-input">
              <option value="" disabled>Select Worker Type</option>
              <option value="Helen_Worker">Helen_Worker</option>
              <option value="Pallet_Worker">Pallet_Worker</option>
              <option value="Sizer_Helen">Sizer_Helen</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="primary-button" @click="saveWorker">{{ editingWorker ? 'Update Worker' : 'Add Worker' }}</button>
            <button class="secondary-button" @click="closeModal">Cancel</button>
          </div>
        </div>
      </div>
  
      <!-- Worker Table -->
      <div v-if="workers.length === 0" class="no-workers">
        <p>No workers available. Add a new worker to get started!</p>
      </div>
      <table v-else class="worker-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Nationality</th>
            <th>Gender</th>
            <th>Worker Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="worker in workers" :key="worker.id">
            <td>{{ worker.fullName }}</td>
            <td>{{ worker.phoneNumber }}</td>
            <td>{{ worker.email }}</td>
            <td>{{ worker.nationality }}</td>
            <td>{{ worker.gender }}</td>
            <td>{{ worker.workerType }}</td>
            <td>
              <button class="edit-button" @click="editWorker(worker)">Edit</button>
              <button class="delete-button" @click="deleteWorker(worker.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const workers = ref([]);
  const worker = ref({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    nationality: '',
    gender: '',
    workerType: '',
  });
  
  const editingWorker = ref(null);
  const showModal = ref(false);
  
  const API_BASE_URL = 'http://localhost:8080/api/v1/worker';
  
  // Fetch all workers on component mount
  onMounted(async () => {
    await fetchWorkers();
  });
  
  // Fetch all workers from API
  async function fetchWorkers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/allWorkers`);
      workers.value = response.data;
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  }
  
  // Add or update worker
  async function saveWorker() {
    try {
      if (editingWorker.value) {
        // Update worker
        const response = await axios.put(`${API_BASE_URL}/updateWorkerById/${editingWorker.value.id}`, worker.value);
        const updatedWorker = response.data;
  
        // Update the worker in the workers list
        const index = workers.value.findIndex((w) => w.id === updatedWorker.id);
        if (index !== -1) {
          workers.value[index] = updatedWorker;
        }
      } else {
        // Add new worker
        const response = await axios.post(`${API_BASE_URL}/addWorker`, worker.value);
        workers.value.push(response.data); // Add the new worker directly to the list
      }
      closeModal();
      resetWorker();
    } catch (error) {
      console.error('Error saving worker:', error);
    }
  }
  
  // Edit a worker (populate form)
  function editWorker(selectedWorker) {
    editingWorker.value = selectedWorker;
    worker.value = { ...selectedWorker };
    showModal.value = true;
  }
  
  // Delete a worker by ID
  async function deleteWorker(id) {
    try {
      await axios.delete(`${API_BASE_URL}/deleteWorkerById/${id}`);
      workers.value = workers.value.filter((w) => w.id !== id); // Remove worker from the list directly
    } catch (error) {
      console.error('Error deleting worker:', error);
    }
  }
  
  // Open modal
  function openModal() {
    resetWorker();
    showModal.value = true;
  }
  
  // Close modal
  function closeModal() {
    showModal.value = false;
  }
  
  // Reset worker form
  function resetWorker() {
    worker.value = {
      fullName: '',
      phoneNumber: '',
      email: '',
      address: '',
      nationality: '',
      gender: '',
      workerType: '',
    };
    editingWorker.value = null;
  }
  </script>
  
  
  <style scoped>
  /* Worker container styling */
  .worker-container {
    padding: 30px;
    background-color: #f8f9fa;
    min-height: 100vh;
    font-family: 'Roboto', sans-serif;
  }
  
  /* Title Styling */
  .worker-container h1 {
    text-align: center;
    color: #34495e;
    font-size: 2.8em;
    font-weight: 600;
    margin-bottom: 40px;
  }
  
  /* Add Worker Button */
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
  .worker-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .worker-table th, .worker-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .worker-table th {
    background-color: #34495e;
    color: white;
  }
  
  .worker-table tr:hover {
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
  
  /* No workers message */
  .no-workers {
    margin-top: 50px;
    text-align: center;
    font-size: 1.5em;
    color: #7f8c8d;
  }
  </style>
  