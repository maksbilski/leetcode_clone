
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
 });