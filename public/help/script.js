document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const message = this.message.value;
    console.log('Wiadomość:', message);

    fetch('/api/help/sendForm', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
       
    })
    .catch((error) => {
        console.error('Error:', error);
        
    });


    this.reset();

    
});
