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


            const rozwiazaneProblemyElement = document.getElementById('stats').getElementsByTagName('h2')[0];
            rozwiazaneProblemyElement.textContent = `Solved problems: ${data.success_count}`;

            // Aktualizacja pasków trudności
            const difficultyBars = document.getElementById('difficulty-bars').getElementsByClassName('label');
            difficultyBars[0].textContent = `Easy: ${data.easy_count}/${data.total_easy}`;
            difficultyBars[1].textContent = `Medium: ${data.medium_count}/${data.total_medium}`;
            difficultyBars[2].textContent = `Hard: ${data.hard_count}/${ data.total_hard}`;

            // Aktualizacja umiejętności
            const skills = document.getElementById('skills').getElementsByClassName('skill');
            skills[0].textContent = `Data bases: ${data.database_count}`;
            skills[1].textContent = `Algorithms: ${data.algorithms_count}`;
            // Dodaj więcej aktualizacji umiejętności, jeśli są dostępne
        });
    
    // Oddzielne zapytanie dla danych kalendarza (bez zmian)
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
                const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
                const lastDayOfMonth = new Date(year, month - 1, daysInMonth).getDay();
                let weekElement = document.createElement('div');
                weekElement.className = 'calendar-week';
                
                for (let i = 0; i < firstDayOfMonth; i++) {
                    const emptySquare = document.createElement('div');
                    emptySquare.className = 'calendar-day empty';
                    weekElement.appendChild(emptySquare);
                }

                for (let i = 1; i <= daysInMonth; i++) {
                    const daySquare = document.createElement('div');
                    daySquare.className = 'calendar-day';
                    daySquare.style.backgroundColor = groupedByMonth[monthYear].includes(i) ? 'green' : 'grey';
                    weekElement.appendChild(daySquare);
                    const dayOfWeek = new Date(year, month - 1, i).getDay();
                    if (dayOfWeek === 6 || i === daysInMonth) {
                        if (i === daysInMonth) {
                            for (let j = lastDayOfMonth + 1; j < 7; j++) {
                                const emptySquare = document.createElement('div');
                                emptySquare.className = 'calendar-day empty';
                                weekElement.appendChild(emptySquare);
                            }
                        }
                        monthElement.appendChild(weekElement);
                        weekElement = document.createElement('div');
                        weekElement.className = 'calendar-week';
                    }
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
                    // Удалите класс 'animate' после завершения анимации
                    setTimeout(() => {
                        toggleButton.classList.remove('animate');
                    }, 500);
                });
        });
        

        
});
