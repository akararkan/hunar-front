<template>
    <div class="order-container">
      <div class="header">
        <h1>Quarry Orders Management</h1>
        <button @click="showAddModal = true" class="btn-primary">Add New Order</button>
      </div>
  
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
  
      <!-- Loading Spinner -->
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
      </div>
  
      <!-- Orders List -->
      <div v-else class="order-list">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Order Code</th>
                <th>Destination</th>
                <th>Owner</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <template v-if="editingId === order.id">
                  <td>{{ order.orderCode }}</td>
                  <td><input v-model="editOrder.dest" class="edit-input" /></td>
                  <td><input v-model="editOrder.ownerName" class="edit-input" /></td>
                  <td><input v-model="editOrder.ownerEmail" class="edit-input" /></td>
                  <td><input v-model="editOrder.ownerPhoneNumber" class="edit-input" /></td>
                  <td>
                    <select v-model="editOrder.status" class="edit-select">
                      <option v-for="status in statuses" :key="status" :value="status">
                        {{ status }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <input v-model="editOrder.quantity" type="number" class="edit-input" />
                  </td>
                  <td class="action-buttons">
                    <button @click="updateOrder" class="btn-save">Save</button>
                    <button @click="editingId = null" class="btn-cancel">Cancel</button>
                  </td>
                </template>
                <template v-else>
                  <td>{{ order.orderCode }}</td>
                  <td>{{ order.dest }}</td>
                  <td>{{ order.ownerName }}</td>
                  <td>{{ order.ownerEmail }}</td>
                  <td>{{ order.ownerPhoneNumber }}</td>
                  <td>{{ order.status }}</td>
                  <td>{{ order.quantity }}</td>
                  <td class="action-buttons">
                    <button @click="startEdit(order)" class="btn-edit">Edit</button>
                    <button @click="deleteOrder(order.id)" class="btn-delete">
                      Delete
                    </button>
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
            <h2>Add New Order</h2>
            <button @click="showAddModal = false" class="close-button">&times;</button>
          </div>
          <form @submit.prevent="addOrder" class="add-form">
            <div class="form-group">
              <label for="dest">Destination</label>
              <input id="dest" v-model="newOrder.dest" required />
            </div>
            <div class="form-group">
              <label for="ownerName">Owner Name</label>
              <input id="ownerName" v-model="newOrder.ownerName" required />
            </div>
            <div class="form-group">
              <label for="ownerEmail">Owner Email</label>
              <input id="ownerEmail" v-model="newOrder.ownerEmail" required />
            </div>
            <div class="form-group">
              <label for="ownerPhoneNumber">Owner Phone Number</label>
              <input id="ownerPhoneNumber" v-model="newOrder.ownerPhoneNumber" required />
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="newOrder.status">
                <option v-for="status in statuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="quantity">Quantity</label>
              <input id="quantity" v-model="newOrder.quantity" type="number" required />
            </div>
            <div class="form-actions">
              <button type="button" @click="showAddModal = false" class="btn-cancel">
                Cancel
              </button>
              <button type="submit" class="btn-primary">Add Order</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  // Variables for holding order data
  const orders = ref([]);
  const statuses = ref(["PREPARING", "READY", "COMPLETED", "CANCELED"]);
  const showAddModal = ref(false);
  const loading = ref(false);
  const error = ref(null);
  
  // Data for new and editing orders
  const newOrder = ref({
    dest: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhoneNumber: "",
    status: "PREPARING",
    quantity: 1,
  });
  
  const editingId = ref(null);
  const editOrder = ref({});
  
  // Fetch orders from the API
  async function fetchOrders() {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch("http://localhost:8080/api/v1/quarry-orders/allOrders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      orders.value = await response.json();
    } catch (err) {
      error.value = "Failed to load orders. Please try again.";
      console.error("Failed to fetch orders:", err);
    } finally {
      loading.value = false;
    }
  }
  
  // Add a new order
  async function addOrder() {
    try {
      const response = await fetch("http://localhost:8080/api/v1/quarry-orders/addOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder.value),
      });
      if (!response.ok) throw new Error("Failed to add order");
      await fetchOrders();
      showAddModal.value = false;
      newOrder.value = {
        dest: "",
        ownerName: "",
        ownerEmail: "",
        ownerPhoneNumber: "",
        status: "PREPARING",
        quantity: 1,
      };
    } catch (err) {
      error.value = "Failed to add order. Please try again.";
      console.error("Failed to add order:", err);
    }
  }
  
  // Edit an order
  function startEdit(order) {
    editingId.value = order.id;
    editOrder.value = { ...order };
  }
  
  // Update the order
  async function updateOrder() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/quarry-orders/updateOrderById/${editingId.value}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editOrder.value),
        }
      );
      if (!response.ok) throw new Error("Failed to update order");
      await fetchOrders();
      editingId.value = null;
    } catch (err) {
      error.value = "Failed to update order. Please try again.";
      console.error("Failed to update order:", err);
    }
  }
  
  // Delete an order
  async function deleteOrder(id) {
    if (!confirm("Are you sure you want to delete this order?")) return;
  
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/quarry-orders/deleteOrderById/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete order");
      await fetchOrders();
    } catch (err) {
      error.value = "Failed to delete order. Please try again.";
      console.error("Failed to delete order:", err);
    }
  }
  
  // Fetch orders on component mount
  onMounted(() => {
    fetchOrders();
  });
  </script>
  <style scoped>
  .quarry-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
  
  th,
  td {
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
  
  .btn-edit,
  .btn-delete,
  .btn-save {
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    border: none;
  }
  .btn-cancel {
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
  
  input,
  textarea,
  select {
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
    transition: 0.4s;
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
    transition: 0.4s;
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      gap: 16px;
    }
  
    th,
    td {
      padding: 8px;
    }
  
    .action-buttons {
      flex-direction: column;
    }
  }
  </style>