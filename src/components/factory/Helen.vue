<template>
  <div class="helen-container">
    <h1>Helen Machine Management</h1>
    <div class="header">
      <button class="primary-button" @click="openModal">Add New Helen</button>
      <button class="primary-button print-button" @click="printTable">Print Report</button>

    </div>
    <hr />

    <!-- Modal for Adding/Editing a Helen -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editingHelen ? "Edit Helen" : "Add New Helen" }}</h3>
        <div class="form-group">
          <input v-model="helen.name" placeholder="Machine Name" class="form-input" />
          <input v-model="helen.type" placeholder="Machine Type" class="form-input" />

          <!-- Worker Dropdown -->
          <label for="worker" class="form-label">Assign Worker</label>
          <select v-model="helen.workerId" id="worker" class="form-input">
            <option value="" disabled>Select Worker</option>
            <option
              v-for="worker in availableWorkers"
              :key="worker.id"
              :value="worker.id"
            >
              {{ worker.fullName }}
            </option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="primary-button" @click="saveHelen">
            {{ editingHelen ? "Update Helen" : "Add Helen" }}
          </button>
          <button class="secondary-button" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Helen Table -->
    <div v-if="helens.length === 0" class="no-helens">
      <p>No helens available. Add a new machine to get started!</p>
    </div>
    <table v-else class="helen-table" id="helenTable">
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
import { ref, onMounted } from "vue";
import axios from "axios";

const helens = ref([]);
const workers = ref([]);
const availableWorkers = ref([]); // For storing workers available to be assigned
const helen = ref({
  name: "",
  type: "",
  workerId: "",
});

const editingHelen = ref(null);
const showModal = ref(false);

const API_BASE_URL = "http://localhost:8080/api/v1";

// Fetch all helens and workers on component mount
onMounted(async () => {
  await fetchHelens();
  await fetchWorkers();
  filterAvailableWorkers();
});

// Fetch all helens from API
async function fetchHelens() {
  try {
    const response = await axios.get(`${API_BASE_URL}/helen/getHelens`);
    helens.value = response.data;
  } catch (error) {
    handleError("Error fetching helens:", error);
  }
}

// Fetch all workers from API
async function fetchWorkers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/worker/allWorkers`);
    workers.value = response.data;
    filterAvailableWorkers(); // Filter workers after fetching
  } catch (error) {
    handleError("Error fetching workers:", error);
  }
}

// Filter available workers who are not assigned to any Helen, unless it's the currently assigned worker in edit mode
function filterAvailableWorkers() {
  if (editingHelen.value) {
    availableWorkers.value = workers.value.filter((worker) => {
      const workerAssigned = helens.value.some((helen) => helen.workerId === worker.id);
      return workerAssigned ? worker.id === editingHelen.value.worker?.id : true; // Include the worker if they are already assigned to the currently edited Helen
    });
  } else {
    availableWorkers.value = workers.value.filter(
      (worker) => !helens.value.some((helen) => helen.workerId === worker.id)
    );
  }
}

// Add or update helen
async function saveHelen() {
  try {
    if (editingHelen.value) {
      // Update helen
      await axios.put(
        `${API_BASE_URL}/helen/updateHelenById/${editingHelen.value.id}`,
        helen.value
      );
    } else {
      // Add new helen
      const response = await axios.post(`${API_BASE_URL}/helen/addHelen`, helen.value, {
        params: {
          workerId: helen.value.workerId,
        },
      });
      helens.value.push(response.data);
    }
    closeModal();
    resetHelen();
    filterAvailableWorkers(); // Re-filter workers after saving
  } catch (error) {
    handleError("Error saving helen:", error);
  }
}

// Edit a helen (populate form)
function editHelen(selectedHelen) {
  editingHelen.value = selectedHelen;
  helen.value = { ...selectedHelen, workerId: selectedHelen.worker?.id };
  showModal.value = true;
  filterAvailableWorkers(); // Re-filter workers when editing a Helen
}

// Delete a helen by ID
async function deleteHelen(id) {
  try {
    await axios.delete(`${API_BASE_URL}/helen/deleteHelenById/${id}`);
    helens.value = helens.value.filter((h) => h.id !== id);
    filterAvailableWorkers(); // Re-filter workers after deleting
  } catch (error) {
    handleError("Error deleting helen:", error);
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
    name: "",
    type: "",
    workerId: "",
  };
  editingHelen.value = null;
  filterAvailableWorkers(); // Ensure the workers list is always updated
}

// Handle errors with alert prompt
function handleError(message, error) {
  console.error(message, error);
  window.alert(message);
}

// Print the Helen table
function printTable() {
  const printContents = document.getElementById("helenTable").outerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // Refresh to reset the view
}
</script>

<style scoped>
/* Helen container styling */
.helen-container {
  padding: 30px;
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
}

/* Title Styling */
.helen-container h1 {
  text-align: center;
  color: #34495e;
  font-size: 2.8em;
  font-weight: 600;
  margin-bottom: 40px;
}

/* Add Helen and Print Buttons */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

/* Print Button Styles */
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

.helen-table th,
.helen-table td {
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

/* Secondary Button */
.secondary-button {
  background-color: #e74c3c;
  color: white;
}

.secondary-button:hover {
  background-color: #c0392b;
}

/* Edit and Delete Buttons */
.edit-button,
.delete-button {
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


.print-button {
  background-color: #3498db;
  color: white;
  font-size: 1.2em;
  padding: 15px 30px;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

/* No helens message */
.no-helens {
  margin-top: 50px;
  text-align: center;
  font-size: 1.5em;
  color: #7f8c8d;
}

/* Print media query to hide unnecessary elements */
@media print {
  .helen-container {
    padding: 0;
    background-color: white;
  }

  .helen-container h1 {
    text-align: center;
    color: #2c3e50;
    font-size: 24pt;
    margin-bottom: 20pt;
  }

  .header,
  .edit-button,
  .delete-button,
  .modal-overlay {
    display: none;
  }

  .helen-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15pt;
    font-size: 10pt;
  }

  .helen-table th,
  .helen-table td {
    border: 1pt solid #34495e;
    padding: 8pt;
    text-align: left;
  }

  .helen-table th {
    background-color: #f2f2f2;
    color: #2c3e50;
    font-weight: bold;
    text-transform: uppercase;
  }

  .helen-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .helen-table tr:hover {
    background-color: transparent;
  }

  /* Add a subtle box shadow to the table */
  .helen-table {
    box-shadow: 0 0 10pt rgba(0, 0, 0, 0.1);
  }

  /* Add a bottom border to the table header */
  .helen-table thead {
    border-bottom: 2pt solid #34495e;
  }

  /* Style the footer with page numbers */
  @page {
    margin: 0.5in;
    @bottom-right {
      content: "Page " counter(page) " of " counter(pages);
      font-size: 8pt;
      color: #7f8c8d;
    }
  }

  /* Add some spacing between rows for better readability */
  .helen-table tr {
    page-break-inside: avoid;
  }

  .helen-table td {
    padding-top: 6pt;
    padding-bottom: 6pt;
  }
}
</style>
