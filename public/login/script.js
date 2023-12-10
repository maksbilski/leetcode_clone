document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();
  console.log('lalalal');
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  var data = {
    name: name,
    email: email,
    password: password
  };
  console.log(data);

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
      console.log(data);
      // Скрываем сообщение об ошибке
      document.getElementById('error-message').textContent = '';

      // Перенаправляем пользователя на страницу с задачами (замените '/tasks' на ваш путь)
      window.location.href = '/exercises';
    })
    .catch(error => {
      console.error(error.message);
      // Отображение сообщения об ошибке на вашей веб-странице
      document.getElementById('error-message').textContent = error.message;
    });
});
