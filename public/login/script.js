document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var data = {
    email: email,
    password: password
  };

  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('error-message').textContent = '';

      window.location.href = '/exercises';
    })
    .catch(error => {
      console.error(error.message);
      document.getElementById('error-message').textContent = error.message;
    });
});
