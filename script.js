document.addEventListener('DOMContentLoaded', () => {
    const findNearbyButton = document.getElementById('findNearbyRescues');
    const rescueList = document.getElementById('rescueList');
    let map;

    // Sample data for rescue NGOs
    const rescueNGOs = [
        { id: 1, name: "Bezubaan Foundation", lat: 26.4478, lng: 80.3464, phone: "(212) 555-1234", address: "VC Motors Mahindra Showroom, in front of Maple Bear Canadian School, Fazalganj Industrial Estate, Shastri Nagar, Kanpur", website: "https://www.bezubaan.org" },
        { id: 2, name: "Furry Friends Shelter", lat: 34.0522, lng: -118.2437, phone: "(323) 555-5678", address: "456 Oak Ave, Los Angeles, CA 90001", website: "https://furryfriends.org" },
        { id: 3, name: "Happy Tails Adoption Center", lat: 41.8781, lng: -87.6298, phone: "(312) 555-9012", address: "789 Elm St, Chicago, IL 60601", website: "https://happytails.org" },
        { id: 4, name: "Second Chance Animal Rescue", lat: 29.7604, lng: -95.3698, phone: "(713) 555-3456", address: "101 Pine Rd, Houston, TX 77001", website: "https://secondchancerescue.org" },
        { id: 5, name: "Whiskers and Paws Foundation", lat: 33.7490, lng: -84.3880, phone: "(404) 555-7890", address: "202 Maple Dr, Atlanta, GA 30301", website: "https://whiskersandpaws.org" },
        { id: 6, name: "Parivartan Kanpur", lat: 26.4673, lng: 80.3498, phone: "Not explicitly listed; check their website for details.", address: "Flat No. 02, Shipra Apartment, Tilak Nagar, Kanpur, Uttar Pradesh", website: "http://www.parivartankanpur.org" },
        { id: 7, name: "People For Animals (PFA) - Kanpur Chapter", lat: 26.4478, lng: 80.3480, phone: "09839603284", address: "Kanpur, Uttar Pradesh", website: "Not explicitly listed." }
    ];

    // Function to display all NGOs
    function displayAllNGOs() {
        rescueList.innerHTML = ''; // Clear existing list
        rescueNGOs.forEach((ngo) => {
            const li = document.createElement('li');
            li.className = 'rescue-item';
            li.innerHTML = `
                <div class="rescue-card">
                    <h3>${ngo.name}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> Address: ${ngo.address}</p>
                    <p><i class="fas fa-phone"></i> Phone: ${ngo.phone}</p>
                    <p><i class="fas fa-globe"></i> Website: <a href="${ngo.website}" target="_blank" rel="noopener noreferrer">${ngo.website}</a></p>
                </div>
            `;
            rescueList.appendChild(li);
        });
    }

    // Call to display all NGOs on page load
    displayAllNGOs();

    // Combine Find Nearby Rescues and Use GPS into one button
    findNearbyButton.addEventListener('click', () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(success, error, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            showError('Geolocation is not supported by your browser');
        }
    });

    function success(position) {
        const { latitude, longitude } = position.coords;
        updateUserLocation(latitude, longitude);
        fetchNearbyNGOs(latitude, longitude);
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        showError('Unable to retrieve your location. Please ensure you have granted location permissions.');
    }

    async function fetchNearbyNGOs(lat, lon) {
        // Simulating a delay to mimic an API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Calculate distances and sort NGOs by distance
        const userLocation = { lat, lon };
        const ngosWithDistance = rescueNGOs.map(ngo => {
            const distance = getDistance(userLocation.lat, userLocation.lon, ngo.lat, ngo.lng);
            return { ...ngo, distance };
        });

        // Sort NGOs by distance
        ngosWithDistance.sort((a, b) => a.distance - b.distance);

        // Call the displayNGOs function with the sorted data
        displayNGOs(ngosWithDistance);
        addMarkers(ngosWithDistance, userLocation);
    }

    function displayNGOs(ngos) {
        rescueList.innerHTML = ''; // Clear existing list
        ngos.forEach((ngo) => {
            const li = document.createElement('li');
            li.className = 'rescue-item';
            li.innerHTML = `
                <div class="rescue-card">
                    <h3>${ngo.name}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> Address: ${ngo.address}</p>
                    <p><i class="fas fa-phone"></i> Phone: ${ngo.phone}</p>
                    <p><i class="fas fa-globe"></i> Website: <a href="${ngo.website}" target="_blank" rel="noopener noreferrer">${ngo.website}</a></p>
                    <p><strong>Distance: ${ngo.distance.toFixed(2)} km</strong></p> <!-- Display distance -->
                </div>
            `;
            rescueList.appendChild(li);
        });
    }

    function addMarkers(ngos, userLocation) {
        // Clear existing markers
        clearMarkers();

        // Add user location marker (red and larger)
        L.marker([userLocation.lat, userLocation.lon], {
            icon: L.divIcon({
                className: 'user-location-marker',
                html: '<i class="fas fa-map-marker-alt" style="color: red; font-size: 28px;"></i>' // Increased size
            })
        }).addTo(map)
            .bindPopup('Your Location')
            .openPopup();

        // Add NGO markers
        ngos.forEach((ngo, index) => {
            const color = index === 0 ? 'green' : 'blue'; // Nearest NGO in green, others in blue
            const size = index === 0 ? '30px' : '20px'; // Nearest NGO larger than others
            L.marker([ngo.lat, ngo.lng], {
                icon: L.divIcon({
                    className: 'ngo-marker',
                    html: `<i class="fas fa-map-marker-alt" style="color: ${color}; font-size: ${size};"></i>`
                })
            }).addTo(map)
                .bindPopup(`<strong>${ngo.name}</strong><br>${ngo.address}<br><a href="${ngo.website}" target="_blank">Website</a>`);
        });
    }

    function clearMarkers() {
        // Clear existing markers logic (if you have a markers array, clear it here)
        // This is a placeholder; implement your own logic to clear markers if needed
    }

    // Function to calculate distance using the Haversine formula
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        return R * c; // Distance in km
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.insertBefore(errorDiv, document.body.firstChild);
        errorDiv.style.opacity = '1';
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            errorDiv.addEventListener('transitionend', () => errorDiv.remove());
        }, 5000);
    }

    // Initialize map only if on the app page (index.html)
    if (document.querySelector('#map')) {
        initMap();
    }

    function initMap() {
        map = L.map('map', {
            minZoom: 2,
            maxZoom: 18
        }).setView([39.8283, -98.5795], 4); // Center on the US
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }

    function updateUserLocation(lat, lng) {
        const userLocation = L.latLng(lat, lng);
        map.setView(userLocation, 10);
        L.marker(userLocation, {
            icon: L.divIcon({
                className: 'user-location-marker',
                html: '<i class="fas fa-map-marker-alt" style="color: red; font-size: 28px;"></i>' // Increased size
            })
        }).addTo(map)
            .bindPopup('Your Location')
            .openPopup();
    }

    document.getElementById('joinForm').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            location: formData.get('location'),
            interests: formData.getAll('interests')
        };
        
        const response = await fetch('/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        alert(`User registered with ID: ${result.user_id}`);
    };
});