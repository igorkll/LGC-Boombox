{
const { exec } = require('child_process');

window.updateDateTime = function () {
    exec('powershell -Command "Get-Date -Format \'yyyy-MM-dd HH:mm:ss\'"', (err, stdout) => {
        if (err) {
            console.error("Error getting system time:", err);
            return;
        }

        // stdout содержит строку "2025-09-01 22:45:30"
        const dateTimeStr = stdout.trim().replace(' ', 'T'); // "2025-09-01T22:45:30"
        const dateObj = new Date(dateTimeStr);

        // Форматируем дату с текстовым месяцем
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', dateOptions);

        // Форматируем время в 24-часовом формате
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);

        document.getElementById('showdate').innerText = formattedDate;
        document.getElementById('showtime').innerText = formattedTime;
    });
}

updateDateTime();

setInterval(updateDateTime, 1000);
}