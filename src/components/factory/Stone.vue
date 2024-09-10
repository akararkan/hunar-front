<template>
  <div class="stone-container">
    <h1>Stone Management</h1>
    <div class="header">
      <button class="primary-button" @click="openModal">Add New Stone</button>
    </div>
    <hr>

    <!-- Modal for Adding a New Stone -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>Add New Stone</h3>
        <div class="form-group">
          <!-- Dropdown for Stone Name -->
          <label for="stoneName" class="form-label">Stone Name:</label>
          <select v-model="newStone.stoneName" id="stoneName" class="form-input">
            <option disabled value="">Select a stone</option>
            <option value="Granite">HAWRAMAN</option>
            <option value="Marble">KAWLOS</option>
            <option value="Limestone">BESTANSWR</option>
            <!-- Add more options as needed -->
          </select>

          <!-- Dropdown for Stone Type -->
          <label for="type" class="form-label">Type:</label>
          <select v-model="newStone.type" id="type" class="form-input">
            <option disabled value="">Select a type</option>
            <option value="MARBLE">MARBLE</option>
            <option value="GRANITE">GRANITE</option>
            <option value="NATURAL">NATURAL</option>
            <!-- Add more options as needed -->
          </select>

          <!-- Regular text input for price -->
          <label for="price" class="form-label">Price (USD):</label>
          <input v-model="newStone.price" placeholder="Enter price" id="price" class="form-input" type="text" />

          <!-- Image Upload -->
          <label for="imageUpload" class="form-label">Upload Image:</label>
          <input type="file" id="imageUpload" @change="onFileChange" class="form-input-file" />
        </div>
        <div class="modal-actions">
          <button class="primary-button" @click="addStone">Add Stone</button>
          <button class="secondary-button" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Stone List and Card Layout -->
    <div v-if="stones.length === 0" class="no-stones">
      <p>No stones available. Add a new stone to get started!</p>
    </div>

    <div v-else class="stone-list">
      <div v-for="stone in stones" :key="stone.id" class="stone-card">
        <div class="card-header">
          <h4>{{ stone.stoneName }}</h4>
          <img v-if="stone.imageUrl" :src="`http://localhost:8080${stone.imageUrl}`" alt="Stone Image" class="stone-image" />
        </div>
        <div class="card-content">
          <p><strong>Description:</strong> {{ stone.description }}</p>
          <p><strong>Location:</strong> {{ stone.location }}</p>
          <p><strong>Type:</strong> {{ stone.type }}</p>
          <p><strong>Color:</strong> {{ stone.color }}</p>
          <p><strong>Price:</strong> {{ stone.price }} USD</p>
        </div>
        <div class="card-actions">
          <button class="edit-button" @click="editStone(stone)">Edit</button>
          <button class="delete-button" @click="deleteStone(stone.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stones = ref([]); // List of stones
const newStone = ref({ stoneName: '', description: '', location: '', type: '', color: '', price: 0, imageUrl: '' }); // New stone input with image URL
const editingStone = ref(null); // Track stone being edited
const showModal = ref(false); // Track if the modal is visible
const selectedImage = ref(null); // Track the selected image file

// Base URL for the API
const API_BASE_URL = 'http://localhost:8080/api/v1/stone';

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
    console.error('Error fetching stones:', error);
  }
}

// Handle file input change
function onFileChange(event) {
  selectedImage.value = event.target.files[0]; // Store the selected file
}

// Add a new stone
async function addStone() {
  if (newStone.value.stoneName && newStone.value.description && newStone.value.location && newStone.value.type && newStone.value.color && newStone.value.price) {
    try {
      // If an image is selected, upload it first
      let imageUrl = '';
      if (selectedImage.value) {
        const formData = new FormData();
        formData.append('file', selectedImage.value);

        // Upload image to the server
        const imageResponse = await axios.post(`${API_BASE_URL}/uploadImage`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        imageUrl = imageResponse.data; // Get the image URL from the server response
        newStone.value.imageUrl = imageUrl; // Store the image URL in the newStone object
      }

      const response = await axios.post(`${API_BASE_URL}/addStone`, newStone.value);
      stones.value.push(response.data);
      newStone.value = { stoneName: '', description: '', location: '', type: '', color: '', price: 0, imageUrl: '' }; // Clear form
      selectedImage.value = null; // Clear image selection
      closeModal(); // Close modal after adding
    } catch (error) {
      console.error('Error adding stone:', error);
    }
  }
}

// Delete a stone by ID
async function deleteStone(id) {
  try {
    await axios.delete(`${API_BASE_URL}/deleteStoneById/${id}`);
    stones.value = stones.value.filter(stone => stone.id !== id);
  } catch (error) {
    console.error('Error deleting stone:', error);
  }
}

// Edit a stone (populate the form)
function editStone(stone) {
  editingStone.value = { ...stone }; // Clone the stone for editing
}

// Open and close modal
function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}
</script>

<style scoped>
/* Overall container for the Stone section */
.stone-container {
  padding: 30px;
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
}

/* Enhanced Title */
.stone-container h1 {
  text-align: center;
  color: #34495e;
  font-size: 2.8em;
  font-weight: 600;
  margin-bottom: 40px;
}

/* Button to add stone on the top-left */
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
  position: relative;
  z-index: 100;
}

.modal h3 {
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
  font-size: 1.8em;
}

/* Modal Form Styling */
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
  transition: all 0.3s ease;
  width: 100%;
}

.form-input-file {
  padding: 8px;
  font-size: 1.1em;
}

.form-input:focus {
  border-color: #2980b9;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
  outline: none;
}

/* Modal Actions */
.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
}

/* Primary Button */
.primary-button {
  background-color: #304eb2;
  color: white;
  font-size: 22px;
  transition: background-color 0.3s ease;
}

.primary-button:hover {
  background-color: #325ac0;
  box-shadow: 0 4px 15px rgba(10, 162, 250, 0.3);
}

/* Secondary Button */
.secondary-button {
  background-color: #95a5a6;
  color: white;
}

.secondary-button:hover {
  background-color: #7f8c8d;
}

/* Stone list layout */
.stone-list {
  display: flex;
  flex-wrap: wrap;
  gap: 30px; /* Increased gap between cards */
  justify-content: center;
  margin-top: 40px;
}

/* Individual stone card */
.stone-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 20px; /* More rounded corners */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); /* Softer, larger shadow */
  width: 400px; /* Wider container for better display */
  text-align: center; /* Center align the content */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stone-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15); /* Stronger shadow on hover */
}

/* Card Header */
.card-header h4 {
  font-size: 1.8em;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}

/* Image Styling */
.stone-image {
  width: 100%;
  height: 280px; /* Larger, consistent height for images */
  object-fit: cover; /* Cover the area with the image while keeping aspect ratio */
  margin-bottom: 20px; /* More space below the image */
  border-radius: 16px; /* Rounded corners for images */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15); /* Larger shadow for images */
}

/* Card content (Description, etc.) */
.card-content p {
  margin: 10px 0;
  font-size: 1.1em; /* Larger, more readable text */
  color: #555; /* Softer text color */
}

/* Card Actions */
.card-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-around; /* More space between buttons */
}

/* Edit and Delete Buttons */
.edit-button, .delete-button {
  padding: 12px 24px; /* Larger padding for buttons */
  font-size: 1.1em;
  font-weight: bold;
  border-radius: 10px;
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
  margin-bottom: 8px;
}


/* No stones message */
.no-stones {
  margin-top: 50px;
  text-align: center;
  font-size: 1.5em;
  color: #7f8c8d;
}
</style>
