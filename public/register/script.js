
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    console.log('dsad')
    event.preventDefault();
  
    var firstName = document.getElementById('firstName').value;
    var surname = document.getElementById('surname').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
  
    var data = {
        firstName: firstName,
        surname: surname,
        email: email,
        password: password
    };
    console.log(data)

    fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
       })
       .then(response => {
        if (!response.ok) {
          throw new Error('You already have an account on leetcode');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        document.getElementById('error-message').textContent = '';
  
        window.location.href = '/exercises';
      })
      .catch(error => {
        console.error(error.message);
        
        document.getElementById('error-message').textContent = error.message;
      });

      
 });