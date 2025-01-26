const fs = require('fs');
const path = require('path');

window.addEventListener('DOMContentLoaded', () => {
  const dataPath = path.join(__dirname, 'dataTag.json');
  let map; // Store the map instance
  const markers = new Map(); // Store markers by tag ID
  let tagData = []; // Store the full data of tags
  let currentLocationMarker; // Marker for the current location

  // Function to initialize or update markers on the map
  function updateMarkers(visibleTags) {
    if (!map) {
      // Initialize the map on the first tag's location
      const firstTag = visibleTags[0];
      map = L.map('map-container').setView([firstTag.latitude, firstTag.longitude], 4);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
    }

    // Remove all markers
    for (const marker of markers.values()) {
      map.removeLayer(marker);
    }
    markers.clear();

    // Add markers for visible tags
    visibleTags.forEach(tag => {
      const marker = L.marker([tag.latitude, tag.longitude])
        .addTo(map)
        .bindPopup(`<b>${tag.name}</b><br>ID: ${tag.id}`);
      markers.set(tag.id, marker);
    });

    console.log(`Markers updated: ${visibleTags.length} tags`);
  }

  // Function to populate the checkbox list
  function populateTagList(tags) {
    const tagList = document.getElementById('tag-list');
    tagList.innerHTML = ''; // Clear the existing list

    tags.forEach(tag => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <label>
          <input type="checkbox" data-id="${tag.id}" checked />
          ${tag.name} (ID: ${tag.id})
        </label>
      `;
      tagList.appendChild(listItem);
    });

    // Add event listeners to the checkboxes
    const checkboxes = tagList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const visibleTags = tagData.filter(tag =>
          tagList.querySelector(`input[data-id="${tag.id}"]`).checked
        );
        updateMarkers(visibleTags);
      });
    });
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

        tagData = tags; // Save the tag data
        populateTagList(tags); // Populate checkboxes
        updateMarkers(tags); // Show all markers initially
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
      }
    });
  }

  // Function to find and display the current location
  function showCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        // Add or update the current location marker
        if (currentLocationMarker) {
          currentLocationMarker.setLatLng([latitude, longitude]);
        } else {
          currentLocationMarker = L.marker([latitude, longitude], { color: 'blue' })
            .addTo(map)
            .bindPopup('You are here');
        }

        // Center the map on the current location
        map.setView([latitude, longitude], 13);

        console.log(`Current location: ${latitude}, ${longitude}`);
      },
      error => {
        alert('Unable to retrieve your location.');
        console.error('Geolocation error:', error);
      }
    );
  }

  // Add event listener for the "Show Current Location" button
  const currentLocationBtn = document.getElementById('current-location-btn');
  currentLocationBtn.addEventListener('click', showCurrentLocation);

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
