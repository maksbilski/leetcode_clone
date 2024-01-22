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


 document.addEventListener('DOMContentLoaded', function() {
    const pathArray = window.location.pathname.split('/');
    const userId = pathArray[pathArray.length - 1];
    console.log(userId);

    if (userId.trim() != ""){
        const privateProfileSection = document.querySelector('.private-profile-section');
        privateProfileSection.style.display = 'none';
    }
    fetch(`/api/profile/aggregate?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            const toggleButton = document.getElementById('toggleButton');
            if (data.private) {
                toggleButton.classList.add('on');
                toggleButton.textContent = 'On';
            } else {
                toggleButton.classList.remove('on');
                toggleButton.textContent = 'Off';
                toggleButton.classList.add('reverse')
            }
            console.log(data);

            const userName = document.getElementById('username');
            userName.textContent = `${data.name}`;

            const rank = document.getElementById('rank');
            rank.textContent = `User rank: ${data.user_rank} / ${data.total_users}`;

            const solvedProblemsElement = document.getElementById('stats').getElementsByTagName('h2')[0];
            solvedProblemsElement.textContent = `Solved problems: ${data.success_count}`;

            const difficultyBars = document.getElementById('difficulty-bars').getElementsByClassName('label');
            difficultyBars[0].textContent = `Easy: ${data.easy_count} / ${data.total_easy}`;
            difficultyBars[1].textContent = `Medium: ${data.medium_count} /${data.total_medium}`;
            difficultyBars[2].textContent = `Hard: ${data.hard_count}/ ${ data.total_hard}`;

            const skills = document.getElementById('skills').getElementsByClassName('skill');
            skills[0].textContent = `Pandas: ${data.pandas_count}`;
            skills[1].textContent = `Algorithms: ${data.algorithms_count}`;
        });

    fetch(`/api/profile/calendar?userId=${userId}`)
        .then(response => response.json())
        .then(calendarDataArray => {
            const groupedByMonth = calendarDataArray.reduce((acc, item) => {
                const date = new Date(item.formatted_date);
                const monthYearKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

                if (!acc[monthYearKey]) {
                    acc[monthYearKey] = [];
                }

                acc[monthYearKey].push(date.getDate());
                return acc;
            }, {});

            const calendarContainer = document.getElementById('calendar');

            Object.keys(groupedByMonth).sort().forEach(monthYear => {
                const [year, month] = monthYear.split('-');
                const monthName = new Date(year, parseInt(month, 10) - 1).toLocaleString('default', { month: 'long' });
                const monthElement = document.createElement('div');
                monthElement.className = 'calendar-month';
                monthElement.textContent = `${monthName} ${year}`;

                const daysInMonth = new Date(year, month, 0).getDate();
                for (let i = 1; i <= daysInMonth; i++) {
                    const daySquare = document.createElement('div');
                    daySquare.className = 'calendar-day';
                    daySquare.style.backgroundColor = groupedByMonth[monthYear].includes(i) ? 'green' : 'grey';
                    monthElement.appendChild(daySquare);
                }

                calendarContainer.appendChild(monthElement);
            });
        });

        fetch(`/api/profile/history?userId=${userId}`)
        .then(response => response.json())
        .then(historyData => {
            const tableBody = document.getElementById('history-table').getElementsByTagName('tbody')[0];

            historyData.forEach(item => {
                const row = document.createElement('tr');

                const exerciseNameCell = document.createElement('td');
                exerciseNameCell.textContent = item.exercise_name;
                row.appendChild(exerciseNameCell);

                const successCell = document.createElement('td');
                successCell.textContent = item.success ? 'Yes' : 'No';
                row.appendChild(successCell);

                const submissionDateCell = document.createElement('td');
                submissionDateCell.textContent = new Date(item.submission_date).toLocaleDateString();
                row.appendChild(submissionDateCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Błąd pobierania historii:', error));

        const toggleButton = document.getElementById('toggleButton');

        toggleButton.addEventListener('click', function (event) {
            event.preventDefault();

            const isOn = toggleButton.classList.contains('on');

            toggleButton.classList.toggle('on');
            toggleButton.classList.toggle('reverse');

            toggleButton.classList.add('animate');

            toggleButton.textContent = isOn ? 'Off' : 'On';

            fetch('/api/profile/toggleState', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId }),
            })
                .then((response) => {
                    if (!response.ok) {
                        if (response.status === 403) {
                            console.error('Brak uprawnień do zmiany tego profilu');
                            throw new Error('Brak uprawnień');
                        }
                        throw new Error('Wystąpił problem z żądaniem');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('Zapytanie wysłane', data);
                })
                .catch((error) => {
                    console.error('Błąd:', error);
                })
                .finally(() => {
                    setTimeout(() => {
                        toggleButton.classList.remove('animate');
                    }, 500);
                });
        });



});
