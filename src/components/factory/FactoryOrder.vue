<template>
  <div class="factory-order-container">
    <h1>Factory Order Management</h1>
    <div class="header">
      <button class="primary-button" @click="openModal">Add New Factory Order</button>
      <button class="primary-button print-button" @click="printTable">Print Report</button>
    </div>
    <hr />

    <!-- Modal for Adding or Editing a Factory Order -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editingOrder ? 'Edit Factory Order' : 'Add New Factory Order' }}</h3>
        <div class="form-group">
          <!-- Order Description -->
          <input
            v-model="newOrder.description"
            placeholder="Order Description"
            class="form-input"
            type="text"
            required
          />

          <!-- Destination -->
          <input
            v-model="newOrder.dest"
            placeholder="Destination"
            class="form-input"
            type="text"
            required
          />

          <!-- Owner Name -->
          <input
            v-model="newOrder.ownerName"
            placeholder="Owner Name"
            class="form-input"
            type="text"
            required
          />

          <!-- Owner Email -->
          <input
            v-model="newOrder.ownerEmail"
            placeholder="Owner Email"
            class="form-input"
            type="email"
            required
          />

          <!-- Owner Phone Number -->
          <input
            v-model="newOrder.ownerPhoneNumber"
            placeholder="Phone Number"
            class="form-input"
            type="text"
            required
          />

          <!-- Order Status -->
          <label for="status" class="form-label">Order Status:</label>
          <select v-model="newOrder.status" id="status" class="form-input">
            <option disabled value="">Select status</option>
            <option value="PREPARING">PREPARING</option>
            <option value="READY">READY</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="primary-button" @click="editingOrder ? updateOrder() : addOrder()">
            {{ editingOrder ? 'Update' : 'Add' }} Factory Order
          </button>
          <button class="secondary-button" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Factory Order List in Table Format -->
    <div v-if="factoryOrders.length === 0" class="no-factory-orders">
      <p>No factory orders available. Add a new order to get started!</p>
    </div>

    <table v-else class="factory-order-table" id="factoryOrderTable">
      <thead>
        <tr>
          <th>Order Code</th>
          <th>Description</th>
          <th>Destination</th>
          <th>Owner</th>
          <th>Phone Number</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in factoryOrders" :key="order.id">
          <td>{{ order.orderCode || 'N/A' }}</td>
          <td>{{ order.description }}</td>
          <td>{{ order.dest }}</td>
          <td>{{ order.ownerName }} ({{ order.ownerEmail }})</td>
          <td>{{ order.ownerPhoneNumber }}</td>
          <td>{{ order.status }}</td>
          <td>
            <button class="edit-button" @click="editOrder(order)">Edit</button>
            <button class="delete-button" @click="deleteOrder(order.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const factoryOrders = ref([]); // List of factory orders

const newOrder = ref({
  description: "",
  dest: "",
  ownerName: "",
  ownerEmail: "",
  ownerPhoneNumber: "",
  status: "",
}); 

const editingOrder = ref(null); // Track order being edited
const showModal = ref(false); // Track if the modal is visible

const API_BASE_URL = "http://localhost:8080/api/v1/factoryOrder";

// Fetch all factory orders on component mount
onMounted(async () => {
  await fetchOrders();
});

// Fetch all factory orders from API
async function fetchOrders() {
  try {
    const response = await axios.get(`${API_BASE_URL}/allOrders`);
    factoryOrders.value = response.data;
  } catch (error) {
    console.error("Error fetching factory orders:", error);
  }
}

// Add a new factory order
async function addOrder() {
  if (
    newOrder.value.description &&
    newOrder.value.dest &&
    newOrder.value.ownerName &&
    newOrder.value.ownerEmail &&
    newOrder.value.ownerPhoneNumber &&
    newOrder.value.status
  ) {
    try {
      const response = await axios.post(`${API_BASE_URL}/addOrder`, newOrder.value);
      factoryOrders.value.push(response.data);
      resetForm();
    } catch (error) {
      console.error("Error adding order:", error);
    }
  }
}

// Update an existing factory order
async function updateOrder() {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateOrderById/${editingOrder.value.id}`, newOrder.value);
    const index = factoryOrders.value.findIndex((order) => order.id === editingOrder.value.id);
    factoryOrders.value[index] = response.data;
    resetForm();
  } catch (error) {
    console.error("Error updating order:", error);
  }
}

// Delete a factory order by ID
async function deleteOrder(id) {
  try {
    await axios.delete(`${API_BASE_URL}/deleteOrderById/${id}`);
    factoryOrders.value = factoryOrders.value.filter((order) => order.id !== id);
  } catch (error) {
    console.error("Error deleting order:", error);
  }
}

// Edit a factory order (populate the form)
function editOrder(order) {
  editingOrder.value = { ...order }; // Clone the order for editing
  newOrder.value = { ...order }; // Populate the form with the selected order data
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
  newOrder.value = {
    description: "",
    dest: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhoneNumber: "",
    status: "",
  };
  editingOrder.value = null;
  closeModal();
}

// Print the Factory Order table
function printTable() {
  const printContents = document.getElementById('factoryOrderTable').outerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // Refresh to reset the view
}
</script>

<style scoped>
/* Overall container for the Factory Order section */
.factory-order-container {
  padding: 30px;
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
}

/* Enhanced Title */
.factory-order-container h1 {
  text-align: center;
  color: #34495e;
  font-size: 2.8em;
  font-weight: 600;
  margin-bottom: 40px;
}

/* Add Order and Print Report Buttons */
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
.factory-order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.factory-order-table th, .factory-order-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.factory-order-table th {
  background-color: #34495e;
  color: white;
}

.factory-order-table tr:hover {
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

/* No factory orders message */
.no-factory-orders {
  margin-top: 50px;
  text-align: center;
  font-size: 1.5em;
  color: #7f8c8d;
}

/* Print media query to hide unnecessary elements */
@media print {
  .factory-order-container {
    padding: 0;
    background-color: white;
  }

  .header, .edit-button, .delete-button, .modal-overlay {
    display: none;
  }

  .factory-order-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15pt;
    font-size: 10pt;
  }

  .factory-order-table th, .factory-order-table td {
    border: 1pt solid #34495e;
    padding: 8pt;
    text-align: left;
  }

  .factory-order-table th {
    background-color: #f2f2f2;
    color: #2c3e50;
    font-weight: bold;
    text-transform: uppercase;
  }

  .factory-order-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .factory-order-table tr:hover {
    background-color: transparent;
  }

  /* Add a subtle box shadow to the table */
  .factory-order-table {
    box-shadow: 0 0 10pt rgba(0, 0, 0, 0.1);
  }

  /* Add a bottom border to the table header */
  .factory-order-table thead {
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
  .factory-order-table tr {
    page-break-inside: avoid;
  }

  .factory-order-table td {
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
