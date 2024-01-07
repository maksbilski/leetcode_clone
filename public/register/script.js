document.getElementById('registrationForm').addEventListener('submit', function (event) {
  event.preventDefault();

  console.log('Before fetch');  // Перемещаем сюда
  var firstName = document.getElementById('firstName').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  var errorMessage = '';

  // If no errors, proceed with registration
  var data = {
     firstName: firstName,
     email: email,
     password: password
  };

  console.log('Before fetch');

  fetch('/api/register', {
     method: 'POST',
     headers: {
        'Content-Type': 'application/json'
     },
     body: JSON.stringify(data)
  })
     .then(response => {
      console.log("aaaaa")
      console.log('Response received');
        if (!response.ok) {
           console.log("Already have account")
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
        console.log('aaaa')
        console.log(error.message)
        console.error(error.message);
        document.getElementById('error-message').textContent = error.message;
     });
});
