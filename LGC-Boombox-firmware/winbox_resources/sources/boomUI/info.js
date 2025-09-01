{
window.updateDateTime = function () {
    const now = new Date();
    
    const dateOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const formattedDate = now.toLocaleDateString('en-US', dateOptions);
    
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    };
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
    
    document.getElementById('showdate').innerText = formattedDate;
    document.getElementById('showtime').innerText = formattedTime;
}

updateDateTime();

setInterval(updateDateTime, 1000);
}