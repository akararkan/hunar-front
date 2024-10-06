<template>
  <div id="quarry-page">
    <quarryMenu class="quarry-navbar" />

    <div class="content-wrapper">
      <quarrySidebar @change-view="setCurrentView" class="quarry-sidebar" />

      <div class="main-container">
        <div class="content-header">
          <h1>{{ currentViewTitle }}</h1>
          <div class="breadcrumbs">
            <span>Dashboard</span>
            <i class="icon-chevron-right"></i>
            <span>{{ currentViewTitle }}</span>
          </div>
        </div>

        <main class="main-content">
            <component :is="currentViewComponent" />
        </main>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 QuarryApp. All Rights Reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Support</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import quarryMenu from './quarry/quarryMenu.vue';
import quarrySidebar from './quarry/quarrySidebar.vue';
import quarryOrder from './quarry/quarryOrder.vue';
import quarryHome from './quarry/quarryHome.vue';
import quarries from './quarry/quarries.vue';
import quarryWorker from './quarry/quarryWorker.vue';
import quarryPackage from './quarry/quarryPackage.vue';

const currentView = ref('quarryHome');

const setCurrentView = (view) => {
  currentView.value = view;
};

const componentMap = {
  quarryHome,
  quarryOrder,
  quarries,
  quarryWorker,
  quarryPackage
};

const titleMap = {
  quarryHome: 'Dashboard',
  quarryOrder: 'Quarry Orders',
  quarries : 'Quarries',
  quarryWorker : "Quarry Workers",
  quarryPackage : "Quarry Packages"
};

const currentViewComponent = computed(() => componentMap[currentView.value] || quarryHome);
const currentViewTitle = computed(() => titleMap[currentView.value] || 'Dashboard');
</script>

<style scoped>
/* Modern Layout Styles */
#quarry-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f1f5f9;
  color: #334155;
  font-family: 'Inter', sans-serif;
}

/* Content Layout */
.content-wrapper {
  display: flex;
  flex-grow: 1;
  gap: 1.5rem;
  padding: 1.5rem;
  padding-top: 5rem; /* Account for fixed navbar */
}

.quarry-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
}

.quarry-sidebar {
  position: sticky;
  top: 5rem; /* Account for fixed navbar */
  height: calc(100vh - 5rem);
}

/* Main Content Area */
.main-container {
  flex-grow: 1;
  max-width: 1400px;
  margin: 0 auto;
}

.content-header {
  margin-bottom: 2rem;
}

.content-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  color: #64748b;
  font-size: 0.875rem;
}

.breadcrumbs i {
  margin: 0 0.5rem;
  font-size: 0.75rem;
}

.main-content {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  padding: 1.5rem;
}

/* Footer Styles */
.footer {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 1.5rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #e2e8f0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-wrapper {
    padding: 1rem;
    padding-top: 4.5rem;
  }
  
  .quarry-sidebar {
    top: 4.5rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    padding-top: 4rem;
  }
  
  .quarry-sidebar {
    position: static;
    height: auto;
    margin-bottom: 1rem;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>