window.addEventListener('DOMContentLoaded', () => {
    // Initialize the map with hardcoded coordinates (Amherst, MA)
    const map = L.map('map-container').setView([42.3942, -72.529], 13);
  
    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
  
    // Add a marker at the hardcoded coordinates
    L.marker([42.3942, -72.529])
      .addTo(map)
      .bindPopup('<b>Sample Tag</b><br>ID: 12345') // Popup with static information
      .openPopup();
  
    console.log('Map initialized with hardcoded data');
  });
  