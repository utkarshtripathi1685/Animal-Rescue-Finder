document.addEventListener('DOMContentLoaded', () => {
    const petGrid = document.querySelector('.pet-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Sample pet data (in a real application, this would come from a database)
    const pets = [
        { name: 'Buddy', type: 'dog', breed: 'Labrador', age: 3, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1' },
        { name: 'Whiskers', type: 'cat', breed: 'Siamese', age: 2, image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8' },
        { name: 'Rex', type: 'dog', breed: 'German Shepherd', age: 5, image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95' },
        { name: 'Mittens', type: 'cat', breed: 'Persian', age: 1, image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131' },
        { name: 'Hoppy', type: 'other', breed: 'Rabbit', age: 1, image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308' },
        { name: 'Polly', type: 'other', breed: 'Parrot', age: 10, image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3' },
    ];

    function createPetCard(pet) {
        const petTypeColors = {
            dog: '#FFD1DC',  // Light pink for dogs
            cat: '#E6E6FA',  // Lavender for cats
            other: '#E0FFFF'  // Light cyan for other pets
        };
        const backgroundColor = petTypeColors[pet.type] || '#F0F8FF';  // Default to AliceBlue if type not found

        return `
            <div class="pet-card" data-type="${pet.type}" style="background-color: ${backgroundColor}; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <img src="${pet.image}" alt="${pet.name}" loading="lazy" style="border-radius: 10px 10px 0 0;">
                <h3 style="color: #333; margin: 10px 0;">${pet.name}</h3>
                <p style="color: #666;">${pet.breed}, ${pet.age} year${pet.age !== 1 ? 's' : ''} old</p>
                <button class="adopt-btn" style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Adopt Me</button>
            </div>
        `;
    }

    function displayPets(petsToShow) {
        petGrid.innerHTML = petsToShow.map(createPetCard).join('');
    }

    function filterPets(type) {
        if (type === 'all') {
            displayPets(pets);
        } else {
            const filteredPets = pets.filter(pet => pet.type === type);
            displayPets(filteredPets);
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterPets(button.dataset.filter);
        });
    });

    // Initial display of all pets
    displayPets(pets);

    // Add event delegation for adopt buttons
    petGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('adopt-btn')) {
            const petName = e.target.closest('.pet-card').querySelector('h3').textContent;
            alert(`Thank you for your interest in adopting ${petName}! We'll contact you soon with next steps.`);
        }
    });

    document.getElementById('adoptForm').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            userId: formData.get('userId'),
            animalId: formData.get('animalId')
        };
        
        const response = await fetch('/adopt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        alert(result.message);
    };
});
