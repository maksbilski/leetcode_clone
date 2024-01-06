 document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/profile/aggregate')
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
    fetch('/api/profile/calendar')
        .then(response => response.json())
        .then(data => {
            const calendarContainer = document.getElementById('calendar');
            Object.keys(data.aktywnosc).forEach(date => {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.style.backgroundColor = data.aktywnosc[date] ? 'green' : 'grey';
                calendarContainer.appendChild(dayElement);
            });
        });
});
