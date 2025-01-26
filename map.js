const fs = require('fs');
const path = require('path');

window.addEventListener('DOMContentLoaded', () => {
  // Define the path to the dataTag.json file
  const dataPath = path.join(__dirname, 'dataTag.json');
  let map; // Store the map instance for updates
  let marker; // Store the marker instance for updates

  // Function to initialize or update the map
  function updateMap(lat, lng, name, id) {
    if (!map) {
      // First time initializing the map
      map = L.map('map-container').setView([lat, lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
    }

    if (marker) {
      // Update the existing marker
      marker.setLatLng([lat, lng]).bindPopup(`<b>${name}</b><br>ID: ${id}`).openPopup();
    } else {
      // Add a new marker
      marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${name}</b><br>ID: ${id}`)
        .openPopup();
    }

    console.log(`Map updated: ${name} (${lat}, ${lng})`);
  }

  // Function to load and parse dataTag.json
  function loadData() {
    fs.readFile(dataPath, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading dataTag.json:', err);
        return;
      }

      try {
        const tagData = JSON.parse(data);

        // Validate the data structure
        if (!tagData.latitude || !tagData.longitude) {
          console.error('Invalid coordinates in dataTag.json');
          return;
        }

        // Update the map with new data
        updateMap(tagData.latitude, tagData.longitude, tagData.name, tagData.id);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
      }
    });
  }

  // Initial load of the dataTag.json
  loadData();

  // Watch for changes to the dataTag.json file
  fs.watch(dataPath, (eventType) => {
    if (eventType === 'change') {
      console.log('dataTag.json changed. Reloading...');
      loadData(); // Reload the file and update the map
    }
  });
});
