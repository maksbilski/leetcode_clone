document.getElementById('exercises').addEventListener('click', function() {
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

  document.getElementById('help').addEventListener('click', function() {
    window.location.href = '/help';
  });

  document.getElementById('home').addEventListener('click', function() {
    window.location.href = '/';
  });

  document.getElementById('profile').addEventListener('click', function() {
    window.location.href = '/profile';
  });

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
      fetch('/api/statistics')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch statistics');
          }
          return response.json();
        })
        .then(statistics => {
          const tableBody = document.getElementById('statisticsTable');
          statistics.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td><a href="#" onclick="redirectToProfile(${record.user_id});">${record.name}</a></td>
              <td>${record.total_exercises_attempted}</td>
              <td>${record.total_exercises_completed}</td>
              <td style="color: #3CB371;">${record.success_rate}%</td>
            `;
            tableBody.appendChild(row);
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
      const tableBody = document.getElementById('statisticsTable');
      while (tableBody.firstChild) {
        tableBody.firstChild.remove();
      }

      fetch(`/api/statistics/sort?key=${key}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to sort statistics by ${key}`);
          }
          return response.json();
        })
        .then(statistics => {
          statistics.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td><a href="#" onclick="redirectToProfile(${record.user_id});">${record.name}</a></td>
              <td>${record.total_exercises_attempted}</td>
              <td>${record.total_exercises_completed}</td>
              <td>${record.success_rate}%</td>
            `;
            tableBody.appendChild(row);
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
    function redirectToProfile(userId) {
        window.location.href = `/profile/${userId}`;
        }