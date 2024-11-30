document.getElementById('donationForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        userId: formData.get('userId'),
        amount: formData.get('amount'),
        frequency: formData.get('frequency')
    };
    
    const response = await fetch('/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    alert(result.message);
};
