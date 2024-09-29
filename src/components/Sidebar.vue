<template>
  <aside class="sidebar">
    <h2>Hunar Factory</h2>
    <ul>
      <li>
        <button
          :class="{ active: activeSection === 'stone' }"
          @click="selectSection('stone')"
        >
          Stone
        </button>
      </li>
      <li>
        <button
          :class="{ active: activeSection === 'worker' }"
          @click="selectSection('worker')"
        >
          Worker
        </button>
      </li>
      <li>
        <button
          :class="{ active: activeSection === 'worker-data' }"
          @click="selectSection('worker-data')"
        >
          Worker Data
        </button>
      </li>
      <li>
        <button
          :class="{ active: activeSection === 'helen' }"
          @click="selectSection('helen')"
        >
          Helen
        </button>
      </li>
      <li>
        <button
          :class="{ active: activeSection === 'factory-order' }"
          @click="selectSection('factory-order')"
        >
          Factory Orders
        </button>
      </li>
      <li>
        <button
          :class="{ active: activeSection === 'package' }"
          @click="selectSection('package')"
        >
          Package
        </button>
      </li>
      <li>
        <button
          :class="{ active: activeSection === 'pallet' }"
          @click="selectSection('pallet')"
        >
          Pallet
        </button>
      </li>
    </ul>

    <!-- Account Section with Username -->
    <div class="account-section" v-if="userProfile">
      <span class="user-name">{{ userProfile.username }}</span>
    </div>

    <!-- Account and Logout Buttons -->
    <div class="account-logout">
      <button class="logout-button" @click="logout">Logout</button>
    </div>

    <!-- Footer -->
    <footer class="sidebar-footer">
      <p>© 2024 Akar</p>
    </footer>
  </aside>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from 'vue-router'; // Assuming you use vue-router

const userProfile = ref(null); // To store user profile data
const router = useRouter(); // To programmatically redirect

// Function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Function to fetch user profile from the backend
const fetchUserProfile = async () => {
  const token = getToken(); // Retrieve token from localStorage

  if (token) {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      userProfile.value = response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Handle unauthenticated user, maybe redirect to login page
      router.push('/login');
    }
  } else {
    console.error("No token found");
    router.push('/login'); // Redirect to login if no token found
  }
};

// Fetch user profile on component mount
onMounted(fetchUserProfile);

// Logout function
async function logout() {
  const token = getToken(); // Retrieve token from localStorage

  if (token) {
    try {
      await axios.post("http://localhost:8080/api/v1/user/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear token from localStorage
      localStorage.removeItem('authToken');

      // Redirect the user to the login page
      router.push('/');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }
}

const emit = defineEmits(["sectionSelected"]);
const props = defineProps({
  activeSection: String, // Receive the active section as a prop from the parent
});

function selectSection(section) {
  emit("sectionSelected", section); // Emit the selected section to the parent
}
</script>

<style scoped>
/* Sidebar styles */
.sidebar {
  width: 280px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}

.sidebar h2 {
  color: #ecf0f1;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
  border-bottom: 1px solid #1abc9c;
  padding-bottom: 1rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin-bottom: 20px;
}

.sidebar ul li button {
  width: 100%;
  background-color: transparent;
  color: white;
  font-size: 1.3rem;
  border: none;
  padding: 10px 20px;
  text-align: left;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.sidebar ul li button:hover {
  background-color: #1abc9c;
  color: #ecf0f1;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.sidebar ul li button.active {
  background-color: #1abc9c;
  color: #ecf0f1;
  font-weight: bold;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

/* Account section styles */
.account-section {
  padding-top: 20px;
  border-top: 1px solid #34495e;
}

.user-name {
  font-size: 1.2rem;
  color: #ecf0f1;
  text-align: center;
  display: block;
}

/* Account and Logout buttons */
.account-logout {
  margin-top: 20px;
}

.logout-button {
  width: 100%;
  background-color: #e74c3c;
  color: white;
  font-size: 1.2rem;
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #c0392b;
}

/* Footer styles */
.sidebar-footer {
  text-align: center;
  margin-top: 30px;
  color: #bdc3c7;
  font-size: 0.9rem;
}
</style>
