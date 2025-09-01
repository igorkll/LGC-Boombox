{
window.updateDateTime = function () {
    getActualTimeDate((dateObj) => {
        // Получаем название месяца и номер месяца
        const monthName = dateObj.toLocaleString('en-US', { month: 'long' });
        const monthNumber = dateObj.getMonth() + 1; // JS months: 0-11

        const day = dateObj.getDate();
        const year = dateObj.getFullYear();

        const formattedDate = `${monthName} (${monthNumber}) - ${day} - ${year}`;

        // Время в 24-часовом формате
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);

        document.getElementById('showdate').innerText = formattedDate;
        document.getElementById('showtime').innerText = formattedTime;
    });
}

updateDateTime();

setInterval(updateDateTime, 1000);
}