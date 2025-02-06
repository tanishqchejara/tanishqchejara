  // Function to handle shared content
  function handleSharedContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const text = urlParams.get('text');
    const url = urlParams.get('url');

    const sharedContentDiv = document.getElementById('shared-content');

    if (title || text || url) {
        let content = '<h2>Shared Content Received</h2>';
        if (title) content += `<p><strong>Title:</strong> ${title}</p>`;
        if (text) content += `<p><strong>Text:</strong> ${text}</p>`;
        if (url) content += `<p><strong>URL:</strong> <a href="${url}" target="_blank">${url}</a></p>`;

        sharedContentDiv.innerHTML = content;

        // Store in localStorage
        const sharedItem = { title, text, url, timestamp: new Date().toISOString() };
        let sharedItems = JSON.parse(localStorage.getItem('sharedItems') || '[]');
        sharedItems.push(sharedItem);
        localStorage.setItem('sharedItems', JSON.stringify(sharedItems));

        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Content Shared', {
                body: 'New content has been shared to your app.'
            });
        }
    }
}

// Function to share PWA with contacts
function sharePWA() {
    if ('contacts' in navigator && 'share' in navigator) {
        navigator.contacts.select(['name', 'email'], {multiple: true})
            .then(contacts => {
                const shareData = {
                    title: 'Check out Tanishq Chejara\'s PWA',
                    text: 'I thought you might be interested in this PWA.',
                    url: window.location.origin + '/tanishqchejara/'
                };
                
                contacts.forEach(contact => {
                    const email = contact.email[0];
                    if (email) {
                        shareData.text += `\n\nSharing with: ${contact.name[0]} (${email})`;
                    }
                });

                navigator.share(shareData)
                    .then(() => console.log('PWA shared successfully'))
                    .catch(err => console.error('Error sharing PWA:', err));
            })
            .catch(err => console.error('Error selecting contacts:', err));
    } else {
        alert('Sharing with contacts is not supported on this device. You can manually share the URL of this page.');
    }
}

// Function to request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
}

// Function to register service worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/tanishqchejara/sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    }
}

// Main initialization function
function init() {
    handleSharedContent();
    requestNotificationPermission();
    registerServiceWorker();

    // Check if this is the first time opening the PWA
    if (!localStorage.getItem('pwaOpened')) {
        localStorage.setItem('pwaOpened', 'true');
        sharePWA();
    }

    // Add event listener for manual sharing
    document.getElementById('share-button').addEventListener('click', sharePWA);
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-96QBHJYW09');











// Time-based color intensity management
function getTimeBasedIntensity() {
    const hour = new Date().getHours();
    
    // Morning: 6-11, Afternoon: 12-17, Evening: 18-21, Night: 22-5
    if (hour >= 6 && hour <= 11) {
        return getComputedStyle(document.documentElement).getPropertyValue('--morning-intensity');
    } else if (hour >= 12 && hour <= 17) {
        return getComputedStyle(document.documentElement).getPropertyValue('--afternoon-intensity');
    } else if (hour >= 18 && hour <= 21) {
        return getComputedStyle(document.documentElement).getPropertyValue('--evening-intensity');
    } else {
        return getComputedStyle(document.documentElement).getPropertyValue('--night-intensity');
    }
}

// Update color intensity based on time
function updateColorIntensity() {
    const intensity = getTimeBasedIntensity();
    document.documentElement.style.setProperty('--color-intensity', intensity);
}

// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Initialize theme with time-based adjustments
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    updateColorIntensity();
}

// Smooth theme toggle with intensity consideration
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add transition class
    document.documentElement.classList.add('theme-transition');
    
    // Toggle theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update intensity
    updateColorIntensity();
    
    // Remove transition class after animation
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
    }, 300);
}

// Share functionality
const shareButton = document.getElementById('share-button');
const sharedContent = document.getElementById('shared-content');

async function sharePortfolio() {
    const shareData = {
        title: 'Tanishq Chejara | 10X Developer',
        text: 'Check out Tanishq Chejara\'s innovative software development portfolio',
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            sharedContent.textContent = 'Thanks for sharing!';
        } else {
            await navigator.clipboard.writeText(window.location.href);
            sharedContent.textContent = 'Link copied to clipboard!';
        }
    } catch (err) {
        console.error('Error sharing:', err);
        sharedContent.textContent = 'Couldn\'t share. Please try copying the URL manually.';
    }

    setTimeout(() => {
        sharedContent.textContent = '';
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeTheme);
themeToggle.addEventListener('click', toggleTheme);
shareButton.addEventListener('click', sharePortfolio);
prefersDarkScheme.addEventListener('change', initializeTheme);

// Update colors periodically based on time
setInterval(updateColorIntensity, 60000); // Check every minute

// Listen for visibility changes to update theme when tab becomes visible
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        updateColorIntensity();
    }
});