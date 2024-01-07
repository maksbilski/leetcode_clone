 document.addEventListener('DOMContentLoaded', function() {
    const pathArray = window.location.pathname.split('/');
    const userId = pathArray[pathArray.length - 1];
    console.log(userId);
    fetch(`/api/profile/aggregate?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            // Aktualizacja liczby rozwiązanych problemów
            const userName = document.getElementById('username');
            userName.textContent = `${data.name}`;

            const rank = document.getElementById('rank');
            rank.textContent = `User rank: ${data.user_rank} / ${data.total_users}`;


            const rozwiazaneProblemyElement = document.getElementById('stats').getElementsByTagName('h2')[0];
            rozwiazaneProblemyElement.textContent = `Rozwiązane Problemy: ${data.success_count}`;

            // Aktualizacja pasków trudności
            const difficultyBars = document.getElementById('difficulty-bars').getElementsByClassName('bar');
            difficultyBars[0].textContent = `Łatwe: ${data.easy_count} / ${data.total_easy}`;
            difficultyBars[1].textContent = `Średnie: ${data.medium_count} /${data.total_medium}`;
            difficultyBars[2].textContent = `Trudne: ${data.hard_count}/ ${ data.total_hard}`;

            // Aktualizacja umiejętności
            const skills = document.getElementById('skills').getElementsByClassName('skill');
            skills[0].textContent = `Bazy Danych: ${data.database_count}`;
            skills[1].textContent = `Algorytmy: ${data.algorithms_count}`;
            // Dodaj więcej aktualizacji umiejętności, jeśli są dostępne
        });
    // Oddzielne zapytanie dla danych kalendarza (bez zmian)
    fetch(`/api/profile/calendar?userId=${userId}`)
        .then(response => response.json())
        .then(calendarDataArray => {
            const calendarData = calendarDataArray.reduce((acc, item) => {
                acc[item.formatted_date] = true; // Zakładamy aktywność w tym dniu
                return acc;
            }, {});

            const calendarContainer = document.getElementById('calendar');
            const currentDate = new Date();
            const tenMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 10, 1);

            Object.keys(calendarData).sort().forEach(date => {
                const dateObj = new Date(date);
                if (dateObj >= tenMonthsAgo) {
                    const monthName = dateObj.toLocaleString('default', { month: 'long' });
                    const year = dateObj.getFullYear();
                    const monthElement = document.createElement('div');
                    monthElement.className = 'calendar-month';
                    monthElement.textContent = `${monthName} ${year}`;

                    const daysInMonth = new Date(year, dateObj.getMonth() + 1, 0).getDate();
                    for (let i = 1; i <= daysInMonth; i++) {
                        const day = `${year}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
                        const daySquare = document.createElement('div');
                        daySquare.className = 'calendar-day';
                        daySquare.style.backgroundColor = calendarData[day] ? 'green' : 'grey';
                        monthElement.appendChild(daySquare);
                    }

                    calendarContainer.appendChild(monthElement);
                }
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
                successCell.textContent = item.success ? 'Tak' : 'Nie';
                row.appendChild(successCell);

                const submissionDateCell = document.createElement('td');
                submissionDateCell.textContent = new Date(item.submission_date).toLocaleDateString();
                row.appendChild(submissionDateCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Błąd pobierania historii:', error));

        const toggleButton = document.getElementById('toggleButton');

        toggleButton.addEventListener('click', function() {
            const isOn = toggleButton.classList.contains('on');
        
            fetch('/api/profile/toggleState', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId })
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403) {
                        console.error('Brak uprawnień do zmiany tego profilu');
                        throw new Error('Brak uprawnień');
                    }
                    throw new Error('Wystąpił problem z żądaniem');
                }
                return response.json();
            })
            .then(data => {
                // Aktualizacja stanu przycisku
                toggleButton.textContent = isOn ? 'Off' : 'On';
                toggleButton.classList.toggle('on');
                console.log("Zapytanie wysłane", data);
            })
            .catch(error => {
                console.error('Błąd:', error);
                // Nie zmieniaj stanu przycisku, jeśli nie masz uprawnień
            });
        });
});
