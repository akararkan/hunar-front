<template>
  <div class="package-container">
    <h1>Package Management</h1>
    <div class="header">
      <button class="primary-button" @click="openModal">Add New Package</button>
      <button class="primary-button print-button" @click="printTable">Print Report</button>
    </div>
    <hr />

    <!-- Modal for Adding or Editing a Package -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editingPackage ? 'Edit Package' : 'Add New Package' }}</h3>
        <div class="form-group">
          <!-- Package Name -->
          <input
            v-model="newPackage.name"
            placeholder="Package Name"
            class="form-input"
            type="text"
            required
          />

          <!-- Package Description -->
          <textarea
            v-model="newPackage.description"
            placeholder="Package Description"
            class="form-input"
            rows="3"
          ></textarea>

          <!-- Total Price -->
          <input
            v-model="newPackage.totalPrice"
            placeholder="Total Price (USD)"
            class="form-input"
            type="number"
            required
          />

          <!-- Factory Order Selection -->
          <label for="factoryOrder" class="form-label">Assign Factory Order:</label>
          <select v-model="newPackage.factoryOrderId" id="factoryOrder" class="form-input">
            <option disabled value="">Select Factory Order</option>
            <option v-for="order in orders" :key="order.id" :value="order.id">
              {{ order.description }} ({{ order.ownerName }}) - {{ order.dest }}
            </option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="primary-button" @click="editingPackage ? updatePackage() : addPackage()">
            {{ editingPackage ? 'Update' : 'Add' }} Package
          </button>
          <button class="secondary-button" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Package List in Table Format -->
    <div v-if="packages.length === 0" class="no-packages">
      <p>No packages available. Add a new package to get started!</p>
    </div>

    <table v-else class="package-table" id="packageTable">
      <thead>
        <tr>
          <th>Package Name</th>
          <th>Description</th>
          <th>Total Price (USD)</th>
          <th>Factory Order</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="packageData in packages" :key="packageData.id">
          <td>{{ packageData.name }}</td>
          <td>{{ packageData.description }}</td>
          <td>{{ packageData.totalPrice }}</td>
          <td>{{ packageData.factoryOrder?.description || 'N/A' }} ({{ packageData.factoryOrder?.ownerName }})</td>
          <td>
            <button class="edit-button" @click="editPackage(packageData)">Edit</button>
            <button class="delete-button" @click="deletePackage(packageData.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const packages = ref([]); // List of packages
const orders = ref([]); // List of factory orders

const newPackage = ref({
  name: "",
  description: "",
  totalPrice: 0,
  factoryOrderId: "",
});

const editingPackage = ref(null); // Track package being edited
const showModal = ref(false); // Track if the modal is visible

const API_BASE_URL = "http://localhost:8080/api/v1/package";

// Fetch all packages and factory orders on component mount
onMounted(async () => {
  await fetchPackages();
  await fetchOrders();  // Fetch orders when the component is mounted
});

// Fetch all packages from API
async function fetchPackages() {
  try {
    const response = await axios.get(`${API_BASE_URL}/allPackages`);
    packages.value = response.data;
  } catch (error) {
    console.error("Error fetching packages:", error);
  }
}

// Fetch all factory orders from API
async function fetchOrders() {
  try {
    const response = await axios.get("http://localhost:8080/api/v1/factoryOrder/allOrders");
    orders.value = response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}

// Add a new package
async function addPackage() {
  if (
    newPackage.value.name &&
    newPackage.value.totalPrice > 0 &&
    newPackage.value.factoryOrderId
  ) {
    try {
      const response = await axios.post(`${API_BASE_URL}/addPackage?orderId=${newPackage.value.factoryOrderId}`, newPackage.value);
      packages.value.push(response.data);
      resetForm();
    } catch (error) {
      console.error("Error adding package:", error);
    }
  }
}

// Update an existing package
async function updatePackage() {
  try {
    const response = await axios.put(`${API_BASE_URL}/updatePackageById/${editingPackage.value.id}`, newPackage.value);
    const index = packages.value.findIndex((packageData) => packageData.id === editingPackage.value.id);
    packages.value[index] = response.data;
    resetForm();
  } catch (error) {
    console.error("Error updating package:", error);
  }
}

// Delete a package by ID
async function deletePackage(id) {
  try {
    await axios.delete(`${API_BASE_URL}/deletePackageById/${id}`);
    packages.value = packages.value.filter((packageData) => packageData.id !== id);
  } catch (error) {
    console.error("Error deleting package:", error);
  }
}

// Edit a package (populate the form)
function editPackage(packageData) {
  editingPackage.value = { ...packageData }; // Clone the package for editing
  newPackage.value = { ...packageData }; // Populate the form with the selected package data
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
  newPackage.value = {
    name: "",
    description: "",
    totalPrice: 0,
    factoryOrderId: "",
  };
  editingPackage.value = null;
  closeModal();
}

// Print the Package table
function printTable() {
  const printContents = document.getElementById('packageTable').outerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // Refresh to reset the view
}
</script>

<style scoped>
/* Package container styling */
.package-container {
  padding: 30px;
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
}

/* Title Styling */
.package-container h1 {
  text-align: center;
  color: #34495e;
  font-size: 2.8em;
  font-weight: 600;
  margin-bottom: 40px;
}

/* Add Package and Print Report Buttons */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
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

/* Print Button */
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
}

.modal h3 {
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
  font-size: 1.8em;
}

/* Table Styling */
.package-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.package-table th, .package-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.package-table th {
  background-color: #34495e;
  color: white;
}

.package-table tr:hover {
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

/* No packages message */
.no-packages {
  margin-top: 50px;
  text-align: center;
  font-size: 1.5em;
  color: #7f8c8d;
}

/* Print media query to hide unnecessary elements */
@media print {
  .package-container {
    padding: 0;
    background-color: white;
  }

  .header, .edit-button, .delete-button, .modal-overlay {
    display: none;
  }

  .package-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15pt;
    font-size: 10pt;
  }

  .package-table th, .package-table td {
    border: 1pt solid #34495e;
    padding: 8pt;
    text-align: left;
  }

  .package-table th {
    background-color: #f2f2f2;
    color: #2c3e50;
    font-weight: bold;
    text-transform: uppercase;
  }

  .package-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .package-table tr:hover {
    background-color: transparent;
  }

  /* Add a subtle box shadow to the table */
  .package-table {
    box-shadow: 0 0 10pt rgba(0, 0, 0, 0.1);
  }

  /* Add a bottom border to the table header */
  .package-table thead {
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
  .package-table tr {
    page-break-inside: avoid;
  }

  .package-table td {
    padding-top: 6pt;
    padding-bottom: 6pt;
  }
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
</style>
