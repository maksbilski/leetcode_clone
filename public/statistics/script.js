// script.js
fetch('/api/statistics')
.then(response => response.json())
.then(data => {
    console.log(data)
   const table = document.getElementById('statisticsTable');
   data.forEach(record => {
       const row = document.createElement('tr');
       const userCell = document.createElement('td');
       const attemptedCell = document.createElement('td');
       const completedCell = document.createElement('td');
       const successCell = document.createElement('td')
       
       userCell.textContent = record.name;
       attemptedCell.textContent = record.total_exercises_attempted;
       completedCell.textContent = record.total_exercises_completed;
       successCell.textContent = record.success_rate;
       
       row.appendChild(userCell);
       row.appendChild(attemptedCell);
       row.appendChild(completedCell);
       row.appendChild(successCell);
       
       table.appendChild(row);
   });
});

document.getElementById('sortSuccessRate').addEventListener('click', function() {
    fetch('/api/statistics/sort?key=success_rate')
    .then(response => response.json())
    .then(data => {
        regenerateTable(data);
    });
 });
 
 document.getElementById('sortAmount').addEventListener('click', function() {
    fetch('/api/statistics/sort?key=total_exercises_completed')
    .then(response => response.json())
    .then(data => {
        regenerateTable(data);
    });
 });
 
 function regenerateTable(data) {
    const table = document.getElementById('statisticsTable');
    // Clear the table
    table.innerHTML = `
        <tr>
            <th>User</th>
            <th>Exercises Attempted</th>
            <th>Exercises Completed</th>
            <th>Success rate</th>
        </tr>
    `;
    // Add the new rows
    data.forEach(record => {
        const row = document.createElement('tr');
        const userCell = document.createElement('td');
        const attemptedCell = document.createElement('td');
        const completedCell = document.createElement('td');
        const successRateCell = document.createElement('td');
        
        userCell.textContent = record.name;
        attemptedCell.textContent = record.total_exercises_attempted;
        completedCell.textContent = record.total_exercises_completed;
        successRateCell.textContent = record.success_rate;
        
        row.appendChild(userCell);
        row.appendChild(attemptedCell);
        row.appendChild(completedCell);
        row.appendChild(successRateCell);
        
        table.appendChild(row);
    });
 }