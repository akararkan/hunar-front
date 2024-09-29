<template>
  <div class="stone-container">
    <h1>Stone Management</h1>
    <div class="header">
      <button class="primary-button" @click="openModal">Add New Stone</button>
      <button class="primary-button print-button" @click="printTable">Print Report</button>
    </div>
    <hr />

    <!-- Modal for Adding a New Stone -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editingStone ? 'Edit Stone' : 'Add New Stone' }}</h3>
        <div class="scrollable-form">
          <div class="form-group">
            <!-- Dropdown for Stone Name -->
            <label for="stoneName" class="form-label">Stone Name:</label>
            <select v-model="newStone.stoneName" id="stoneName" class="form-input">
              <option disabled value="">Select a stone</option>
              <option value="HAWRAMAN">HAWRAMAN</option>
              <option value="KAWLOS">KAWLOS</option>
              <option value="BESTANSWR">BESTANSWR</option>
            </select>

            <!-- Description -->
            <label for="description" class="form-label">Description:</label>
            <input
              v-model="newStone.description"
              placeholder="Enter description"
              id="description"
              class="form-input"
              type="text"
            />

            <!-- Location -->
            <label for="location" class="form-label">Location:</label>
            <input
              v-model="newStone.location"
              placeholder="Enter location"
              id="location"
              class="form-input"
              type="text"
            />

            <!-- Dropdown for Stone Type -->
            <label for="type" class="form-label">Type:</label>
            <select v-model="newStone.type" id="type" class="form-input">
              <option disabled value="">Select a type</option>
              <option value="MARBLE">MARBLE</option>
              <option value="GRANITE">GRANITE</option>
              <option value="NATURE">NATURE</option>
            </select>

            <!-- Color -->
            <label for="color" class="form-label">Color:</label>
            <input
              v-model="newStone.color"
              placeholder="Enter color"
              id="color"
              class="form-input"
              type="text"
            />

            <!-- Regular text input for price -->
            <label for="price" class="form-label">Price (USD):</label>
            <input
              v-model="newStone.price"
              placeholder="Enter price"
              id="price"
              class="form-input"
              type="number"
            />

            <!-- Image Upload -->
            <label for="imageUpload" class="form-label">Upload Image:</label>
            <input
              type="file"
              id="imageUpload"
              @change="onFileChange"
              class="form-input-file"
            />
          </div>
        </div>
        <div class="modal-actions">
          <button class="primary-button" @click="editingStone ? updateStone() : addStone()">
            {{ editingStone ? 'Update' : 'Add' }} Stone
          </button>
          <button class="secondary-button" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Stone List in Table Format -->
    <div v-if="stones.length === 0" class="no-stones">
      <p>No stones available. Add a new stone to get started!</p>
    </div>

    <div v-else class="stone-table-wrapper">
      <table class="stone-table" id="stoneTable">
        <thead>
          <tr>
            <th>Image</th>
            <th>Stone Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Type</th>
            <th>Color</th>
            <th>Price (USD)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stone in stones" :key="stone.id">
            <td>
              <img
                v-if="stone.imageUrl"
                :src="`http://localhost:8080${stone.imageUrl}`"
                alt="Stone Image"
                class="stone-image-table"
                @click="openImage(stone.imageUrl)"
              />
            </td>
            <td>{{ stone.stoneName }}</td>
            <td>{{ stone.description }}</td>
            <td>{{ stone.location }}</td>
            <td>{{ stone.type }}</td>
            <td>{{ stone.color }}</td>
            <td>{{ stone.price }} USD</td>
            <td>
              <button class="edit-button" @click="openEditModal(stone)">Edit</button>
              <button class="delete-button" @click="deleteStone(stone.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const stones = ref([]); // List of stones
const newStone = ref({
  stoneName: "",
  description: "",
  location: "",
  type: "",
  color: "",
  price: 0,
  imageUrl: "",
}); // New stone input with image URL
const editingStone = ref(null); // Track stone being edited
const showModal = ref(false); // Track if the modal is visible
const selectedImage = ref(null); // Track the selected image file

// Base URL for the API
const API_BASE_URL = "http://localhost:8080/api/v1/stone";

// Fetch all stones on component mount
onMounted(async () => {
  await fetchStones();
});

// Fetch all stones from API
async function fetchStones() {
  try {
    const response = await axios.get(`${API_BASE_URL}/allStones`);
    stones.value = response.data;
  } catch (error) {
    console.error("Error fetching stones:", error);
  }
}

// Handle file input change
function onFileChange(event) {
  selectedImage.value = event.target.files[0]; // Store the selected file
}

// Add a new stone
async function addStone() {
  if (
    newStone.value.stoneName &&
    newStone.value.description &&
    newStone.value.location &&
    newStone.value.type &&
    newStone.value.color &&
    newStone.value.price
  ) {
    try {
      // If an image is selected, upload it first
      let imageUrl = "";
      if (selectedImage.value) {
        const formData = new FormData();
        formData.append("file", selectedImage.value);

        // Upload image to the server
        const imageResponse = await axios.post(`${API_BASE_URL}/uploadImage`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        imageUrl = imageResponse.data; // Get the image URL from the server response
        newStone.value.imageUrl = imageUrl; // Store the image URL in the newStone object
      }

      const response = await axios.post(`${API_BASE_URL}/addStone`, newStone.value);
      stones.value.push(response.data);
      resetForm();
    } catch (error) {
      console.error("Error adding stone:", error);
    }
  }
}

// Update an existing stone
async function updateStone() {
  try {
    if (selectedImage.value) {
      const formData = new FormData();
      formData.append("file", selectedImage.value);

      // Upload image to the server if a new one is selected
      const imageResponse = await axios.post(`${API_BASE_URL}/uploadImage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      newStone.value.imageUrl = imageResponse.data;
    }

    const response = await axios.put(`${API_BASE_URL}/updateStoneById/${editingStone.value.id}`, newStone.value);
    const index = stones.value.findIndex((stone) => stone.id === editingStone.value.id);
    stones.value[index] = response.data;
    resetForm();
  } catch (error) {
    console.error("Error updating stone:", error);
  }
}

// Delete a stone by ID
async function deleteStone(id) {
  try {
    await axios.delete(`${API_BASE_URL}/deleteStoneById/${id}`);
    stones.value = stones.value.filter((stone) => stone.id !== id);
  } catch (error) {
    console.error("Error deleting stone:", error);
  }
}

// Open modal for editing
function openEditModal(stone) {
  editingStone.value = stone;
  newStone.value = { ...stone }; // Populate form with selected stone
  showModal.value = true; // Show the modal for editing
}

// Open image in a new tab
function openImage(imageUrl) {
  window.open(`http://localhost:8080${imageUrl}`, "_blank");
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
  newStone.value = {
    stoneName: "",
    description: "",
    location: "",
    type: "",
    color: "",
    price: 0,
    imageUrl: "",
  };
  editingStone.value = null;
  selectedImage.value = null;
  closeModal();
}

// Print the Stone table
function printTable() {
  const printContents = document.getElementById("stoneTable").outerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // Refresh to reset the view
}
</script>

<style scoped>
/* Overall container for the Stone section */
.stone-container {
  padding: 30px;
  background-color: #f0f4f8;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
}

/* Enhanced Title */
.stone-container h1 {
  text-align: center;
  color: #2c3e50;
  font-size: 3em;
  font-weight: 700;
  margin-bottom: 40px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Button to add stone on the top-left and Print Report on the top-right */
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
  overflow-y: auto; /* Enable scrolling */
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

.form-input-file {
  padding: 8px;
  font-size: 1.1em;
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

/* Stone Table */
.stone-table-wrapper {
  margin-top: 40px;
  overflow-x: auto; /* Enable horizontal scrolling on small screens */
}

.stone-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.stone-table th,
.stone-table td {
  padding: 15px;
  text-align: left;
  font-size: 1.1em;
  color: #555;
  border-bottom: 1px solid #ccc;
}

.stone-table th {
  background-color: #2c3e50;
  color: white;
  text-transform: uppercase;
}

.stone-table td img {
  max-width: 100px;
  border-radius: 10px;
}

.stone-table td {
  vertical-align: middle;
}

.edit-button,
.delete-button {
  padding: 8px 16px;
  font-size: 1em;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Edit Button Styling */
.edit-button {
  background-color: #3498db;
  color: white;
}

.edit-button:hover {
  background-color: #2980b9;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* Delete Button Styling */
.delete-button {
  background-color: #e74c3c;
  color: white;
}

.delete-button:hover {
  background-color: #c0392b;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

/* Modal form labels */
.form-label {
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

/* No stones message */
.no-stones {
  margin-top: 50px;
  text-align: center;
  font-size: 1.8em;
  color: #7f8c8d;
}

/* Print media query to hide unnecessary elements */
@media print {
  .stone-container {
    padding: 0;
    background-color: white;
  }

  .header,
  .edit-button,
  .delete-button,
  .modal-overlay {
    display: none;
  }

  .stone-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15pt;
    font-size: 10pt;
  }

  .stone-table th,
  .stone-table td {
    border: 1pt solid #34495e;
    padding: 8pt;
    text-align: left;
  }

  .stone-table th {
    background-color: #f2f2f2;
    color: #2c3e50;
    font-weight: bold;
    text-transform: uppercase;
  }

  .stone-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .stone-table tr:hover {
    background-color: transparent;
  }

  /* Add a subtle box shadow to the table */
  .stone-table {
    box-shadow: 0 0 10pt rgba(0, 0, 0, 0.1);
  }

  /* Add a bottom border to the table header */
  .stone-table thead {
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
  .stone-table tr {
    page-break-inside: avoid;
  }

  .stone-table td {
    padding-top: 6pt;
    padding-bottom: 6pt;
  }
}

</style>
