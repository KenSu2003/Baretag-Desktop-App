const fs = require('fs');
const path = require('path');

window.addEventListener('DOMContentLoaded', () => {
  const dataPath = path.join(__dirname, 'dataTag.json');
  let map; // Store the map instance
  const markers = new Map(); // Store markers by tag ID for updates

  // Function to initialize or update markers on the map
  function updateMarkers(tags) {
    if (!map) {
      // Initialize the map on the first tag's location
      const firstTag = tags[0];
      map = L.map('map-container').setView([firstTag.latitude, firstTag.longitude], 4);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
    }

    // Remove markers that are no longer in the data
    const currentIds = new Set(tags.map(tag => tag.id));
    for (const [id, marker] of markers.entries()) {
      if (!currentIds.has(id)) {
        map.removeLayer(marker);
        markers.delete(id);
      }
    }

    // Add or update markers for each tag
    tags.forEach(tag => {
      if (markers.has(tag.id)) {
        // Update existing marker
        const marker = markers.get(tag.id);
        marker.setLatLng([tag.latitude, tag.longitude])
          .bindPopup(`<b>${tag.name}</b><br>ID: ${tag.id}`);
      } else {
        // Create a new marker
        const marker = L.marker([tag.latitude, tag.longitude])
          .addTo(map)
          .bindPopup(`<b>${tag.name}</b><br>ID: ${tag.id}`);
        markers.set(tag.id, marker);
      }
    });

    console.log(`Markers updated: ${tags.length} tags`);
  }

  // Function to load and parse dataTag.json
  function loadData() {
    fs.readFile(dataPath, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading dataTag.json:', err);
        return;
      }

      try {
        const tags = JSON.parse(data);

        if (!Array.isArray(tags)) {
          console.error('Invalid data format: Expected an array of tags');
          return;
        }

        updateMarkers(tags);
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
      loadData();
    }
  });
});
