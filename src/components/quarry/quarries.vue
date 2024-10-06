<script setup>
import { ref, onMounted } from 'vue'

const quarries = ref([])
const showAddModal = ref(false)
const loading = ref(false)
const error = ref(null)

const newQuarry = ref({
  name: '',
  description: '',
  location: '',
  type: 'MARBLE',
  availability: true
})

const types = ['MARBLE', 'GRANITE', 'NATURE']
const editingId = ref(null)
const editQuarry = ref({})

async function fetchQuarries() {
  loading.value = true
  error.value = null
  try {
    const response = await fetch('http://localhost:8080/api/v1/quarry/allQuarries')
    if (!response.ok) throw new Error('Failed to fetch quarries')
    quarries.value = await response.json()
  } catch (err) {
    error.value = 'Failed to load quarries. Please try again.'
    console.error('Failed to fetch quarries:', err)
  } finally {
    loading.value = false
  }
}

async function addQuarry() {
  try {
    const response = await fetch('http://localhost:8080/api/v1/quarry/addQuarry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newQuarry.value)
    })
    if (!response.ok) throw new Error('Failed to add quarry')
    await fetchQuarries()
    showAddModal.value = false
    newQuarry.value = {
      name: '',
      description: '',
      location: '',
      type: 'MARBLE',
      availability: true
    }
  } catch (err) {
    error.value = 'Failed to add quarry. Please try again.'
    console.error('Failed to add quarry:', err)
  }
}

async function deleteQuarry(id) {
  if (!confirm('Are you sure you want to delete this quarry?')) return
  
  try {
    const response = await fetch(`http://localhost:8080/api/v1/quarry/deleteById/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete quarry')
    await fetchQuarries()
  } catch (err) {
    error.value = 'Failed to delete quarry. Please try again.'
    console.error('Failed to delete quarry:', err)
  }
}

function startEdit(quarry) {
  editingId.value = quarry.id
  editQuarry.value = { ...quarry }
}

async function updateQuarry() {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/quarry/updateById/${editingId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editQuarry.value)
    })
    if (!response.ok) throw new Error('Failed to update quarry')
    await fetchQuarries()
    editingId.value = null
  } catch (err) {
    error.value = 'Failed to update quarry. Please try again.'
    console.error('Failed to update quarry:', err)
  }
}

onMounted(() => {
  fetchQuarries()
})
</script>

<template>
  <div class="quarry-container">
    <div class="header">
      <h1>Quarry Management</h1>
      <button @click="showAddModal = true" class="btn-primary">
        Add New Quarry
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
    </div>

    <!-- Quarry List -->
    <div v-else class="quarry-list">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="quarry in quarries" :key="quarry.id">
              <template v-if="editingId === quarry.id">
                <td><input v-model="editQuarry.name" class="edit-input"></td>
                <td><input v-model="editQuarry.description" class="edit-input"></td>
                <td><input v-model="editQuarry.location" class="edit-input"></td>
                <td>
                  <select v-model="editQuarry.type" class="edit-select">
                    <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
                  </select>
                </td>
                <td>
                  <label class="switch">
                    <input type="checkbox" v-model="editQuarry.availability">
                    <span class="slider"></span>
                  </label>
                </td>
                <td class="action-buttons">
                  <button @click="updateQuarry" class="btn-save">Save</button>
                  <button @click="editingId = null" class="btn-cancel">Cancel</button>
                </td>
              </template>
              <template v-else>
                <td>{{ quarry.name }}</td>
                <td>{{ quarry.description }}</td>
                <td>{{ quarry.location }}</td>
                <td><span class="type-badge" :class="quarry.type.toLowerCase()">{{ quarry.type }}</span></td>
                <td>
                  <span class="status-badge" :class="{ available: quarry.availability }">
                    {{ quarry.availability ? 'Available' : 'Unavailable' }}
                  </span>
                </td>
                <td class="action-buttons">
                  <button @click="startEdit(quarry)" class="btn-edit">Edit</button>
                  <button @click="deleteQuarry(quarry.id)" class="btn-delete">Delete</button>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Quarry</h2>
          <button @click="showAddModal = false" class="close-button">&times;</button>
        </div>
        <form @submit.prevent="addQuarry" class="add-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input id="name" v-model="newQuarry.name" required>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="newQuarry.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="location">Location</label>
            <input id="location" v-model="newQuarry.location" required>
          </div>
          <div class="form-group">
            <label for="type">Type</label>
            <select id="type" v-model="newQuarry.type">
              <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="switch-label">
              Availability
              <label class="switch">
                <input type="checkbox" v-model="newQuarry.availability">
                <span class="slider"></span>
              </label>
            </label>
          </div>
          <div class="form-actions">
            <button type="button" @click="showAddModal = false" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-primary">Add Quarry</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quarry-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 28px;
  color: #2c3e50;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #4b5563;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.type-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.type-badge.marble {
  background-color: #e0f2fe;
  color: #0369a1;
}

.type-badge.granite {
  background-color: #fef3c7;
  color: #92400e;
}

.type-badge.nature {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fee2e2;
  color: #dc2626;
}

.status-badge.available {
  background-color: #dcfce7;
  color: #166534;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete, .btn-save {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}
.btn-cancel{
  padding: 10px 10px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  margin-right: 10px;
  background-color: #dc2626;
  color: white;

}

.btn-edit {
  background-color: #f3f4f6;
  color: #4b5563;
}

.btn-delete {
  background-color: #fee2e2;
  color: #dc2626;
}

.btn-save {
  background-color: #dcfce7;
  color: #166534;
}



/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

label {
  font-weight: 500;
  color: #374151;
}

input, textarea, select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 16px;
}

textarea {
  height: 100px;
  resize: vertical;
}

/* Switch Styles */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #3b82f6;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Loading Spinner */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner {
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 16px;
  }
  
  th, td {
    padding: 8px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>