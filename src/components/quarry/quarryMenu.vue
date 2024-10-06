<template>
  <nav class="navbar">
    <div class="navbar-left">
      <div class="navbar-logo">
        <router-link to="/">
          <i class="icon-mountain logo-icon"></i>
          <span class="logo-text">QuarryApp</span>
        </router-link>
      </div>
    </div>

    <div class="navbar-center">
      <div class="search-bar">
        <i class="icon-search"></i>
        <input type="text" placeholder="Search...">
      </div>
    </div>

    <div class="navbar-right">
      <div class="notification-icon">
        <i class="icon-bell"></i>
        <span class="notification-badge">3</span>
      </div>
      
      <div class="user-info">
        <div class="user-avatar">JD</div>
        <div class="user-details">
          <span class="username">John Doe</span>
          <span class="user-role">Admin</span>
        </div>
        <button class="logout-btn">
          <i class="icon-log-out"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
// You can add more functionality here if needed
</script>

<style scoped>
/* Modern Navigation Bar Styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background: linear-gradient(to right, #1a1f25, #2c3e50);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 1000;
}

/* Left section - Logo */
.navbar-logo a {
  display: flex;
  align-items: center;
  color: #3b82f6;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.3s ease;
}

.logo-icon {
  font-size: 1.75rem;
  margin-right: 0.5rem;
}

.logo-text {
  background: linear-gradient(120deg, #3b82f6, #1abc9c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Center section - Search */
.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 500px;
  margin: 0 2rem;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  width: 100%;
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.search-bar i {
  color: #94a3b8;
  margin-right: 0.5rem;
}

.search-bar input {
  background: transparent;
  border: none;
  color: white;
  width: 100%;
  outline: none;
}

.search-bar input::placeholder {
  color: #94a3b8;
}

/* Right section - User Info */
.navbar-right {
  display: flex;
  align-items: center;
}

.notification-icon {
  position: relative;
  margin-right: 1.5rem;
  cursor: pointer;
}

.notification-icon i {
  color: #e2e8f0;
  font-size: 1.25rem;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  padding: 0.25rem;
  font-size: 0.75rem;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1a1f25;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(120deg, #3b82f6, #1abc9c);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  margin-right: 1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
}

.username {
  color: white;
  font-weight: 600;
}

.user-role {
  color: #94a3b8;
  font-size: 0.75rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn i {
  margin-right: 0.5rem;
}

.logout-btn:hover {
  background-color: #ef4444;
  color: white;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .navbar-center {
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.75rem 1rem;
  }
  
  .navbar-center {
    display: none;
  }
  
  .user-details {
    display: none;
  }
  
  .logout-btn span {
    display: none;
  }
  
  .logout-btn i {
    margin-right: 0;
  }
}
</style>