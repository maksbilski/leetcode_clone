document.getElementById('exercises').addEventListener('click', function() {
  console.log('dsa')
  window.location.href = '/exercises';
});

document.getElementById('statistics').addEventListener('click', function() {
  window.location.href = '/statistics';
});

document.getElementById('register').addEventListener('click', function() {
  window.location.href = '/register';
});

document.getElementById('login').addEventListener('click', function() {
  window.location.href = '/login';
});

document.getElementById('home').addEventListener('click', function() {
  window.location.href = '/';
});

document.getElementById('help').addEventListener('click', function() {
  window.location.href = '/help';
});

document.getElementById('profile').addEventListener('click', function() {
  window.location.href = '/profile';
});

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
