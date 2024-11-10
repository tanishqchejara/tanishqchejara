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