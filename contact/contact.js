window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-96QBHJYW09');


document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Time-based color adjustment function
  const adjustColorsForTime = () => {
      const hour = new Date().getHours();
      let timeOfDay;
      
      if (hour >= 5 && hour < 10) timeOfDay = 'morning';
      else if (hour >= 10 && hour < 16) timeOfDay = 'noon';
      else if (hour >= 16 && hour < 20) timeOfDay = 'evening';
      else timeOfDay = 'night';
      
      // Update CSS variables based on time of day
      document.body.style.setProperty('--color-bg', `var(--color-bg-${timeOfDay})`);
      document.body.style.setProperty('--color-text', `var(--color-text-${timeOfDay})`);
      document.body.style.setProperty('--color-text-muted', `var(--color-text-muted-${timeOfDay})`);
      document.body.style.setProperty('--color-border', `var(--color-border-${timeOfDay})`);
      document.body.style.setProperty('--shadow', `var(--shadow-${timeOfDay})`);
  };

  // Theme toggle functionality with smooth transition
  const toggleTheme = () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Add transition class
      document.body.classList.add('theme-transitioning');
      
      // Update theme
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Animate theme toggle button
      themeToggle.style.transform = 'rotate(180deg)';
      setTimeout(() => {
          themeToggle.style.transform = 'rotate(0)';
          // Remove transition class after animation
          document.body.classList.remove('theme-transitioning');
      }, 300);
      
      // Adjust colors for current time
      adjustColorsForTime();
  };

  // Initialize theme
  const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
          document.body.setAttribute('data-theme', savedTheme);
      } else if (prefersDarkScheme.matches) {
          document.body.setAttribute('data-theme', 'dark');
      }
      adjustColorsForTime();
  };

  // Event listeners
  themeToggle.addEventListener('click', toggleTheme);
  prefersDarkScheme.addEventListener('change', initializeTheme);
  
  // Update colors every hour
  initializeTheme();
  setInterval(adjustColorsForTime, 3600000); // Check every hour
  
  // Update when tab becomes visible
  document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
          adjustColorsForTime();
      }
  });

});