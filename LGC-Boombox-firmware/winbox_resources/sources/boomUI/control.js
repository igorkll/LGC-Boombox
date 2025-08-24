{
const { exec } = require('child_process');

document.getElementById('poweroff_button').addEventListener('custom_click', () => {
    exec('shutdown /s /t 600');
})

document.getElementById('volume_button').addEventListener('custom_click', () => {
    
})
}