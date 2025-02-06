window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-96QBHJYW09');



// Theme and Color Management
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  
  // Time-based color adaptation
  function updateColorsByTime() {
      const hour = new Date().getHours();
      const isDark = root.getAttribute('data-theme') === 'dark';
      
      if (isDark) {
          // Dark theme variations
          if (hour >= 18 || hour < 6) {
              // Night colors (18:00 - 06:00)
              root.style.setProperty('--background', 'var(--background-dark-night)');
              root.style.setProperty('--text', 'var(--text-dark-night)');
              root.style.setProperty('--text-muted', 'var(--text-muted-dark-night)');
              root.style.setProperty('--border', 'var(--border-dark-night)');
          } else {
              // Evening colors for dark theme (06:00 - 18:00)
              root.style.setProperty('--background', 'var(--background-dark-evening)');
              root.style.setProperty('--text', 'var(--text-dark-evening)');
              root.style.setProperty('--text-muted', 'var(--text-muted-dark-evening)');
              root.style.setProperty('--border', 'var(--border-dark-evening)');
          }
      } else {
          // Light theme variations
          if (hour >= 17 || hour < 6) {
              // Evening colors (17:00 - 06:00)
              root.style.setProperty('--background', 'var(--background-evening)');
              root.style.setProperty('--text', 'var(--text-evening)');
              root.style.setProperty('--text-muted', 'var(--text-muted-evening)');
              root.style.setProperty('--border', 'var(--border-evening)');
          } else {
              // Morning colors (06:00 - 17:00)
              root.style.setProperty('--background', 'var(--background-morning)');
              root.style.setProperty('--text', 'var(--text-morning)');
              root.style.setProperty('--text-muted', 'var(--text-muted-morning)');
              root.style.setProperty('--border', 'var(--border-morning)');
          }
      }
  }

  // Theme toggle with smooth transition
  function toggleTheme() {
      const currentTheme = root.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Add transition class for smooth change
      root.classList.add('theme-transition');
      
      // Update theme
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update colors based on time
      updateColorsByTime();
      
      // Remove transition class after animation
      setTimeout(() => {
          root.classList.remove('theme-transition');
      }, 500);
  }

  // Initialize theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
      root.setAttribute('data-theme', savedTheme);
      updateColorsByTime();
  } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
          root.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
          updateColorsByTime();
      }
  }

  // Event Listeners
  themeToggle.addEventListener('click', toggleTheme);
  
  // Update colors every hour
  updateColorsByTime();
  setInterval(updateColorsByTime, 3600000); // Check every hour
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
          root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
          updateColorsByTime();
      }
  });
});