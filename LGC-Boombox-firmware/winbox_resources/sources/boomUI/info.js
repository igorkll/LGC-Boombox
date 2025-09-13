{
let timeUpdating = false;

window.updateDateTime = function () {
    if (timeUpdating) return;
    timeUpdating = true;

    getActualTimeDate((dateObj) => {
        const monthName = dateObj.toLocaleString('en-US', { month: 'long' });
        const monthNumber = dateObj.getMonth() + 1;

        const day = dateObj.getDate();
        const year = dateObj.getFullYear();

        const formattedDate = `${monthName} (${monthNumber}) - ${day} - ${year}`;

        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);

        document.getElementById('showdate').innerText = formattedDate;
        document.getElementById('showtime').innerText = formattedTime;

        timeUpdating = false;
    });
}

updateDateTime();

setInterval(updateDateTime, 1000);
}