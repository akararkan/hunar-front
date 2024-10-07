<template>
  <aside class="side-menu">
    <div class="menu-header">
      <h2>Quarry Portal</h2>
      <p>Manage your operations</p>
    </div>
    <ul>
      <li>
        <a @click="changeView('quarryHome')" href="javascript:void(0)" class="menu-item">
          <i class="icon-home"></i>
          <span>Home</span>
          <div class="hover-indicator"></div>
        </a>
      </li>
      <li>
        <a @click="changeView('quarryOrder')" href="javascript:void(0)" class="menu-item">
          <i class="icon-clipboard"></i>
          <span>Quarry Orders</span>
          <div class="hover-indicator"></div>
        </a>
      </li>
      <li>
        <a @click="changeView('quarries')" href="javascript:void(0)" class="menu-item">
          <i class="icon-mountain"></i>
          <span>Quarries</span>
          <div class="hover-indicator"></div>
        </a>
      </li>
      <li>
        <a @click="changeView('quarryWorker')" href="javascript:void(0)" class="menu-item">
          <i class="icon-users"></i>
          <span>Quarry Workers</span>
          <div class="hover-indicator"></div>
        </a>
      </li>
      <li>
        <a @click="changeView('quarryPackage')" href="javascript:void(0)" class="menu-item">
          <i class="icon-package"></i>
          <span>Quarry Packages</span>
          <div class="hover-indicator"></div>
        </a>
      </li>
      
    </ul>
    <div class="support-card">
      <div class="support-icon">
        <i class="icon-headphones"></i>
      </div>
      <div class="support-text">
        <h3>Need Help?</h3>
        <p>Contact support</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
const emit = defineEmits(['change-view']);
const changeView = (view) => {
  emit('change-view', view);
};
</script>

<style scoped>
/* Modern Side Menu Styles */
.side-menu {
  width: 280px;
  height: 100vh;
  background: linear-gradient(145deg, #1a1f25 0%, #2c3e50 100%);
  padding: 2rem 1.5rem;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
}

.menu-header {
  margin-bottom: 2rem;
  padding: 0 0.5rem;
}

.menu-header h2 {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.menu-header p {
  color: #94a3b8;
  font-size: 0.875rem;
}

.side-menu ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.side-menu li {
  margin-bottom: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  color: #e2e8f0;
  text-decoration: none;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-item i {
  font-size: 1.25rem;
  margin-right: 1rem;
  transition: transform 0.3s ease;
}



.menu-item span {
  font-size: 1rem;
  font-weight: 500;
}

.hover-indicator {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: #3b82f6;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.support-card {
  position: absolute;
  bottom: 2rem;
  left: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.support-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.support-icon i {
  color: white;
  font-size: 1.25rem;
}

.support-text h3 {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.support-text p {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
}
/* Active State Styles */
.menu-item.active {
  background: rgba(83, 96, 14, 0.1);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  color: #3b82f6;
}

.menu-item.active .hover-indicator {
  transform: scaleY(1);
}

.menu-item.active i {
  color: #3b82f6;
}

/* Hover Styles */
.menu-item {
  display: flex;
  align-items: center;
  color: #e2e8f0;
  text-decoration: none;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.menu-item i {
  font-size: 1.25rem;
  margin-right: 1rem;
  transition: transform 0.3s ease;
}

.menu-item span {
  font-size: 1rem;
  font-weight: 500;
}

/* Focus Styles */
.menu-item:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.menu-item:focus .hover-indicator {
  transform: scaleY(1);
}

.menu-item:focus i {
  color: #3b82f6;
}

/* Hover and Focus Animation for Icons */
.menu-item:hover i,
.menu-item:focus i {
  transform: translateX(5px);
  color: #3b82f6;
}

.menu-item:hover .hover-indicator,
.menu-item:focus .hover-indicator {
  transform: scaleY(1);
}

/* Hover Indicator */
.hover-indicator {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: #3b82f6;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

/* Support Card Styles */
.support-card {
  position: absolute;
  bottom: 2rem;
  left: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.support-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.support-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  transition: all 0.3s ease;
}

.support-icon i {
  color: white;
  font-size: 1.25rem;
}

.support-text h3 {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.support-text p {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .side-menu {
    width: 240px;
  }

  .menu-item span {
    font-size: 0.875rem;
  }
}


</style>