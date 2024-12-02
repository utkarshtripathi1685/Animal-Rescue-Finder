document.addEventListener('DOMContentLoaded', () => {
    const petGrid = document.querySelector('.pet-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Sample pet data (in a real application, this would come from a database)
    const pets = [
        { name: 'Buddy', type: 'dog', breed: 'Labrador', age: 3, image: 'images/pet1.jpg' },
        { name: 'Whiskers', type: 'cat', breed: 'Siamese', age: 2, image: 'images/pet2.jpg' },
        { name: 'Rex', type: 'dog', breed: 'German Shepherd', age: 5, image: 'images/pet3.jpg' },
        { name: 'Mittens', type: 'cat', breed: 'Persian', age: 1, image: 'images/pet4.jpg' },
        { name: 'Hoppy', type: 'other', breed: 'Rabbit', age: 1, image: 'images/pet5.jpg' },
        { name: 'Polly', type: 'other', breed: 'Parrot', age: 10, image: 'images/pet6.jpg' },
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
