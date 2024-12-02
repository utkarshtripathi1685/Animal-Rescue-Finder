class FeedbackForm {
    constructor() {
        this.form = document.getElementById('feedbackForm');
        this.ratingInputs = document.querySelectorAll('input[name="rating"]');
        this.categorySelect = document.getElementById('category');
        this.commentTextarea = document.getElementById('comment');
        this.submitButton = document.getElementById('submitFeedback');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.ratingInputs.forEach(input => {
            input.addEventListener('change', () => this.updateStarRating());
        });
    }

    updateStarRating() {
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const stars = document.querySelectorAll('.star-rating label');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        if (!rating) {
            alert('Please select a rating');
            return;
        }

        const feedbackData = {
            userId: getCurrentUserId(), // Implement this function based on your auth system
            rating: parseInt(rating),
            category: this.categorySelect.value,
            comment: this.commentTextarea.value
        };

        try {
            const response = await fetch('/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData)
            });

            if (response.ok) {
                alert('Thank you for your feedback!');
                this.form.reset();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit feedback');
        }
    }
} 