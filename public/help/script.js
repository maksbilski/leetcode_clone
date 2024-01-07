document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const message = this.message.value;
    console.log('Wiadomość:', message);

    fetch('/api/help/sendForm', { // Zastąp 'URL_SERWERA' adresem URL, na który chcesz wysłać zapytanie POST
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Możesz tutaj obsłużyć odpowiedź, np. wyświetlić potwierdzenie
    })
    .catch((error) => {
        console.error('Error:', error);
        // Obsługa błędów
    });

    // Opcjonalnie, możesz wyczyścić formularz po wysłaniu
    this.reset();

    
});
