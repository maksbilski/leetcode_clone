document.getElementById('exercises').addEventListener('click', function () {
	window.location.href = '/exercises';
  });

  document.getElementById('statistics').addEventListener('click', function () {
	window.location.href = '/statistics';
  });

  document.getElementById('register').addEventListener('click', function () {
	window.location.href = '/register';
  });

  document.getElementById('home').addEventListener('click', function () {
	window.location.href = '/';
  });

  document.getElementById('login').addEventListener('click', function () {
	window.location.href = '/login';
  });

  document.getElementById('help').addEventListener('click', function () {
	window.location.href = '/help';
  });

  document.getElementById('profile').addEventListener('click', function () {
	window.location.href = '/profile';
  });


  function redirectToLoginPage() {
	window.location.href = '/login';
  }

  function redirectToMainPage() {
	window.location.href = '/register';
  }


  function toggleDropdown() {
	const dropdownOptions = document.getElementById('dropdown-options');
	dropdownOptions.classList.toggle('show');
  }

  function selectOption(option) {
	const selectedOption = document.querySelector('.selected-option');
	selectedOption.textContent = option.textContent;
	toggleDropdown();
	sortBy(option.getAttribute('value'));
  }

  document.addEventListener('DOMContentLoaded', function () {
	fetch('/api/exercises')
	  .then(response => {
		if (!response.ok) {
		  throw new Error('Failed to fetch exercises');
		}
		return response.json();
	  })
	  .then(exercises => {
		const exerciseList = document.getElementById('exerciseList');
		exercises.forEach(exercise => {
		  const row = document.createElement('tr');
		  const difficultyClass = `difficulty-${exercise.difficulty.toLowerCase()}`;
		  const categoryClass = `category-${exercise.category.toLowerCase()}`;
		  const status = exercise.success;
		  let statusIcon;
		  if (status == true) {
			statusIcon = '<i class="fas fa-check"></i>';
		  } else if (status == false) {
			statusIcon = '<i class="fas fa-spinner"></i>';
		  } else {
			statusIcon = '';
		  }
		  row.innerHTML = `
			<td>${statusIcon}</td>
			<td class="exercise-name"><a href="/exercises/${exercise.exercise_id}">${exercise.name}</a></td>
			<td class="${categoryClass}">${exercise.category}</td>
			<td class="${difficultyClass}">${exercise.difficulty}</td>
		  `;
		  exerciseList.appendChild(row);
		});
	  })
	  .catch(error => {
		console.error(error);
	  });
  });

  function sortBy(key) {
	if (key == "") {
	  return;
	}
	const exerciseList = document.getElementById('exerciseList');
	while (exerciseList.firstChild) {
	  exerciseList.firstChild.remove();
	}

	fetch(`/api/exercises/sort?key=${key}`)
	  .then(response => {
		if (!response.ok) {
		  throw new Error(`Failed to sort exercises by ${key}`);
		}
		return response.json();
	  })
	  .then(exercises => {
		exercises.forEach(exercise => {
		  const row = document.createElement('tr');
		  const difficultyClass = `difficulty-${exercise.difficulty.toLowerCase()}`;
		  const categoryClass = `category-${exercise.category.toLowerCase()}`;
		  const status = exercise.success;
		  let statusIcon;
		  if (status == true) {
			statusIcon = '<i class="fas fa-check"></i>';
		  } else if (status == false) {
			statusIcon = '<i class="fas fa-spinner"></i>';
		  } else {
			statusIcon = '';
		  }
		  row.innerHTML = `
			<td>${statusIcon}</td>
			<td><a href="/exercises/${exercise.exercise_id}">${exercise.name}</a></td>
			<td class="${categoryClass}">${exercise.category}</td>
			<td class="${difficultyClass}">${exercise.difficulty}</td>
		  `;
		  exerciseList.appendChild(row);
		});
	  })
	  .catch(error => {
		console.error(error);
	  });
  }

  document.addEventListener('DOMContentLoaded', function () {
	const sessionTimeout = 300000;
	let sessionTimer;

	function refreshSession() {
	  fetch('/api/refresh-session')
		.then(response => {
		  if (!response.ok) {
			throw new Error('Failed to refresh session');
		  }
		  return response.json();
		})
		.then(data => {
		  resetSessionTimer();
		})
		.catch(error => {
		  console.error('Error refreshing session:', error);
		});
	}

	function showSessionExpiredNotification() {
	  const exerciseTable = document.querySelector('table');
	  if (exerciseTable) {
		exerciseTable.style.display = 'none';
	  }

	  const notificationContainer = document.getElementById('notification-container');
	  if (notificationContainer) {
		notificationContainer.style.display = 'block';
	  }
	}

	window.closeNotificationBanner = function () {
	  const exerciseTable = document.querySelector('table');
	  if (exerciseTable) {
		exerciseTable.style.display = 'table';
	  }

	  const notificationContainer = document.getElementById('notification-container');
	  if (notificationContainer) {
		notificationContainer.style.display = 'none';
	  }
	};

	function redirectToLoginPage() {
	  window.location.href = '/login';
	}

	function resetSessionTimer() {
	  clearTimeout(sessionTimer);

	  sessionTimer = setTimeout(() => {
		showSessionExpiredNotification();
	  }, sessionTimeout);
	}
	resetSessionTimer();

	const refreshInterval = setInterval(refreshSession, 240000);

	document.addEventListener('mousemove', resetSessionTimer);
	document.addEventListener('keydown', resetSessionTimer);

	window.addEventListener('beforeunload', function () {
	  clearInterval(refreshInterval);
	});
  });