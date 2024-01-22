document.getElementById('registrationForm').addEventListener('submit', function (event) {
  event.preventDefault();

  var firstName = document.getElementById('firstName').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  var errorMessage = '';

  var data = {
     firstName: firstName,
     email: email,
     password: password
  };


  fetch('/api/register', {
     method: 'POST',
     headers: {
        'Content-Type': 'application/json'
     },
     body: JSON.stringify(data)
  })
     .then(response => {
        if (!response.ok) {
           throw new Error('You already have an account!');
        }
        return response.json();
     })
     .then(data => {
        console.log(data);
        document.getElementById('error-message').textContent = '';
        window.location.href = '/exercises';
     })
     .catch(error => {
        console.log(error.message)
        console.error(error.message);
        document.getElementById('error-message').textContent = error.message;
      });

      
 });