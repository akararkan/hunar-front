<template>
  <div class="pallet-container">
    <h1>Pallet Management</h1>
    <div class="header">
      <button class="primary-button" @click="openModal">Add New Pallet</button>
      <button class="primary-button print-button" @click="printTable">Print Report</button>
    </div>
    <hr />

    <!-- Modal for Adding or Editing a Pallet -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editingPallet ? 'Edit Pallet' : 'Add New Pallet' }}</h3>
        <div class="scrollable-form">
          <div class="form-group">
            <!-- Stone Name -->
            <label for="stoneName" class="form-label">Stone Name:</label>
            <select v-model="newPallet.stoneName" id="stoneName" class="form-input">
              <option disabled value="">Select a stone</option>
              <option value="HAWRAMAN">HAWRAMAN</option>
              <option value="KAWLOS">KAWLOS</option>
              <option value="BESTANSWR">BESTANSWR</option>
            </select>

            <!-- Weight -->
            <label for="weight" class="form-label">Weight (kg):</label>
            <input
              v-model="newPallet.weight"
              placeholder="Enter weight"
              id="weight"
              class="form-input"
              type="number"
            />

            <!-- Stone Size -->
            <label for="stoneSize" class="form-label">Stone Size:</label>
            <select v-model="newPallet.stoneSize" id="stoneSize" class="form-input">
              <option disabled value="">Select a size</option>
              <option value="SURFACE3">SURFACE3</option>
              <option value="SURFACE4">SURFACE4</option>
              <!-- Add more stone size options as needed -->
            </select>

            <!-- Meter Measure -->
            <label for="meter" class="form-label">Meter Measure:</label>
            <select v-model="newPallet.meter" id="meter" class="form-input">
              <option disabled value="">Select a meter measure</option>
              <option value="METER_SQUARE">Square Meter</option>
              <option value="METER_LENGTH">Length Meter</option>
            </select>

            <!-- Meter Amount -->
            <label for="meterMount" class="form-label">Meter Amount:</label>
            <input
              v-model="newPallet.meterMount"
              placeholder="Enter meter amount"
              id="meterMount"
              class="form-input"
              type="number"
            />

            <!-- Price -->
            <label for="price" class="form-label">Price (USD):</label>
            <input
              v-model="newPallet.price"
              placeholder="Enter price"
              id="price"
              class="form-input"
              type="number"
            />

            <!-- Package Selection -->
            <label for="package" class="form-label">Assign Package:</label>
            <select v-model="newPallet.packageId" id="package" class="form-input">
              <option disabled value="">Select Package</option>
              <option v-for="packageData in packages" :key="packageData.id" :value="packageData.id">
                {{ packageData.name }} - {{ packageData.description }}
              </option>
            </select>

            <!-- Worker Selection -->
            <label for="worker" class="form-label">Assign Worker:</label>
            <select v-model="newPallet.workerId" id="worker" class="form-input">
              <option disabled value="">Select Worker</option>
              <option v-for="worker in workers" :key="worker.id" :value="worker.id">
                {{ worker.fullName }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="primary-button" @click="editingPallet ? updatePallet() : addPallet()">
            {{ editingPallet ? 'Update' : 'Add' }} Pallet
          </button>
          <button class="secondary-button" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Pallet List Table -->
    <div v-if="pallets.length === 0" class="no-pallets">
      <p>No pallets available. Add a new pallet to get started!</p>
    </div>

    <table v-else class="pallet-table" id="palletTable">
      <thead>
        <tr>
          <th>Stone Name</th>
          <th>Weight</th>
          <th>Size</th>
          <th>Meter Measure</th>
          <th>Meter Amount</th>
          <th>Price (USD)</th>
          <th>Package</th>
          <th>Worker</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pallet in pallets" :key="pallet.id">
          <td>{{ pallet.stoneName || 'N/A' }}</td>
          <td>{{ pallet.weight || 'N/A' }} kg</td>
          <td>{{ pallet.stoneSize || 'N/A' }}</td>
          <td>{{ pallet.meter || 'N/A' }}</td>
          <td>{{ pallet.meterMount || 'N/A' }}</td>
          <td>{{ pallet.price || 'N/A' }} USD</td>
          <td>{{ pallet.apackage?.name || 'N/A' }}</td>
          <td>{{ pallet.worker?.fullName || 'N/A' }}</td>
          <td>
            <button class="edit-button" @click="editPallet(pallet)">Edit</button>
            <button class="delete-button" @click="deletePallet(pallet.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// State management for pallets, packages, and workers
const pallets = ref([]); // List of pallets
const packages = ref([]); // List of packages
const workers = ref([]); // List of workers

// New pallet form data
const newPallet = ref({
  stoneName: "",
  weight: 0,
  stoneSize: "",
  meter: "",
  meterMount: 0,
  price: 0,
  packageId: "",
  workerId: "",
});

const editingPallet = ref(null); // Track pallet being edited
const showModal = ref(false); // Track if the modal is visible

const API_BASE_URL = "http://localhost:8080/api/v1/pallet";

// Fetch all pallets, packages, and workers on component mount
onMounted(async () => {
  await fetchPallets();
  await fetchPackages();
  await fetchWorkers();
});

// Fetch all pallets from API
async function fetchPallets() {
  try {
    const response = await axios.get(`${API_BASE_URL}/allPallets`);
    pallets.value = response.data;
  } catch (error) {
    console.error("Error fetching pallets:", error);
  }
}

// Fetch all packages from API
async function fetchPackages() {
  try {
    const response = await axios.get("http://localhost:8080/api/v1/package/allPackages");
    packages.value = response.data;
  } catch (error) {
    console.error("Error fetching packages:", error);
  }
}

// Fetch all workers from API
async function fetchWorkers() {
  try {
    const response = await axios.get("http://localhost:8080/api/v1/worker/allWorkers");
    workers.value = response.data;
  } catch (error) {
    console.error("Error fetching workers:", error);
  }
}

// Add a new pallet
async function addPallet() {
  if (
    newPallet.value.stoneName &&
    newPallet.value.weight > 0 &&
    newPallet.value.stoneSize &&
    newPallet.value.meter &&
    newPallet.value.meterMount > 0 &&
    newPallet.value.price > 0 &&
    newPallet.value.packageId &&
    newPallet.value.workerId
  ) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/addPallet?packageId=${newPallet.value.packageId}&workerId=${newPallet.value.workerId}`,
        newPallet.value
      );
      pallets.value.push(response.data);
      resetForm();
    } catch (error) {
      console.error("Error adding pallet:", error);
    }
  } else {
    console.log("Form is incomplete:", newPallet.value);
  }
}

// Update an existing pallet
async function updatePallet() {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/updatePalletById/${editingPallet.value.id}?packageId=${newPallet.value.packageId}&workerId=${newPallet.value.workerId}`,
      newPallet.value
    );
    const index = pallets.value.findIndex((pallet) => pallet.id === editingPallet.value.id);
    pallets.value[index] = response.data;
    resetForm();
  } catch (error) {
    console.error("Error updating pallet:", error);
  }
}

// Delete a pallet by ID
async function deletePallet(id) {
  try {
    await axios.delete(`${API_BASE_URL}/deletePalletById/${id}`);
    pallets.value = pallets.value.filter((pallet) => pallet.id !== id);
  } catch (error) {
    console.error("Error deleting pallet:", error);
  }
}

// Edit a pallet (populate the form)
function editPallet(pallet) {
  editingPallet.value = { ...pallet }; // Clone the pallet for editing
  newPallet.value = { ...pallet }; // Populate the form with the selected pallet data
  showModal.value = true; // Open the modal for editing
}

// Open and close modal
function openModal() {
  resetForm();
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

// Reset the form
function resetForm() {
  newPallet.value = {
    stoneName: "",
    weight: 0,
    stoneSize: "",
    meter: "",
    meterMount: 0,
    price: 0,
    packageId: "",
    workerId: "",
  };
  editingPallet.value = null;
  closeModal();
}

// Print the Pallet table
function printTable() {
  const printContents = document.getElementById("palletTable").outerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // Refresh to reset the view
}
</script>

<style scoped>
/* Overall container for the Pallet section */
.pallet-container {
  padding: 30px;
  background-color: #f0f4f8;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
}

/* Enhanced Title */
.pallet-container h1 {
  text-align: center;
  color: #2c3e50;
  font-size: 3em;
  font-weight: 700;
  margin-bottom: 40px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Header with buttons aligned to the left and right */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

/* Button Styles */
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

/* Modal styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: #fff;
  padding: 40px;
  border-radius: 16px;
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Scrollable form content */
.scrollable-form {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
}

.modal h3 {
  margin-bottom: 20px;
  color: #34495e;
  text-align: center;
  font-size: 2em;
  font-weight: 600;
}

/* Modal Form Styling */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-input {
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1.1em;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #2980b9;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
  outline: none;
}

/* Modal Actions */
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

/* Secondary Button */
.secondary-button {
  background-color: #e74c3c;
  color: white;
}

.secondary-button:hover {
  background-color: #c0392b;
}

/* Pallet table layout */
.pallet-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.pallet-table th,
.pallet-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.pallet-table th {
  background-color: #34495e;
  color: white;
}

.pallet-table tr:hover {
  background-color: #f1f1f1;
}

/* Edit and Delete Buttons */
.edit-button,
.delete-button {
  padding: 8px 16px;
  font-size: 1em;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
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

/* No pallets message */
.no-pallets {
  margin-top: 50px;
  text-align: center;
  font-size: 1.8em;
  color: #7f8c8d;
}

/* Print media query to hide unnecessary elements */
@media print {
  .pallet-container {
    padding: 0;
    background-color: white;
  }

  .header,
  .edit-button,
  .delete-button,
  .modal-overlay {
    display: none;
  }

  .pallet-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15pt;
    font-size: 10pt;
  }

  .pallet-table th,
  .pallet-table td {
    border: 1pt solid #34495e;
    padding: 8pt;
    text-align: left;
  }

  .pallet-table th {
    background-color: #f2f2f2;
    color: #2c3e50;
    font-weight: bold;
    text-transform: uppercase;
  }

  .pallet-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .pallet-table tr:hover {
    background-color: transparent;
  }

  /* Add a subtle box shadow to the table */
  .pallet-table {
    box-shadow: 0 0 10pt rgba(0, 0, 0, 0.1);
  }

  /* Add a bottom border to the table header */
  .pallet-table thead {
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
  .pallet-table tr {
    page-break-inside: avoid;
  }

  .pallet-table td {
    padding-top: 6pt;
    padding-bottom: 6pt;
  }
}
</style>
