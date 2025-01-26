const fs = require('fs');
const path = require('path');

window.addEventListener('DOMContentLoaded', () => {
  // Define the path to the dataTag.json file
  const dataPath = path.join(__dirname, 'dataTag.json');

  // Read the JSON file
  fs.readFile(dataPath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading dataTag.json:', err);
      return;
    }

    try {
      // Parse the JSON data
      const tagData = JSON.parse(data);
      console.log('Extracted tag data:', tagData); // Debug: Ensure data is loaded correctly

      // Validate the JSON structure
      if (!tagData.latitude || !tagData.longitude) {
        console.error('Invalid coordinates in dataTag.json');
        return;
      }

      // Pass the data to the map (next steps below)
      initializeMap(tagData.latitude, tagData.longitude, tagData.name, tagData.id);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }
  });

  // Function to initialize the map
  function initializeMap(lat, lng, name, id) {
    const map = L.map('map-container').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add a marker at the extracted location
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<b>${name}</b><br>ID: ${id}`)
      .openPopup();

    console.log('Map initialized at:', lat, lng);
  }
});
