// Tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Stopwatch and Lap Timer functionality
let time = 0;  // Start at 0
let interval;
let isRunning = false;
let laps = [];

function formatTime(ms) {
    const date = new Date(ms);
    return date.toISOString().substr(11, 11);
}

function updateDisplay(elementId) {
    document.querySelector(`#${elementId} .time-display`).textContent = formatTime(time);
}

function startStop(timerId) {
    const button = document.querySelector(`#${timerId}-startstop`);
    if (isRunning) {
        clearInterval(interval);
        button.textContent = 'Start';
    } else {
        interval = setInterval(() => {
            time += 10;  // Increment time by 10ms for more accuracy
            updateDisplay(timerId);
        }, 10);  // Update every 10ms
        button.textContent = 'Stop';
    }
    isRunning = !isRunning;
}

function reset(timerId) {
    clearInterval(interval);
    time = 0;  // Reset time to 0
    isRunning = false;
    updateDisplay(timerId);
    document.querySelector(`#${timerId}-startstop`).textContent = 'Start';
    if (timerId === 'laptimer') {
        laps = [];
        document.getElementById('lap-list').innerHTML = '';  // Clear laps
    }
}

// Stopwatch
document.getElementById('stopwatch-startstop').addEventListener('click', () => startStop('stopwatch'));
document.getElementById('stopwatch-reset').addEventListener('click', () => reset('stopwatch'));

// Lap Timer
document.getElementById('laptimer-startstop').addEventListener('click', () => startStop('laptimer'));
document.getElementById('laptimer-reset').addEventListener('click', () => reset('laptimer'));
document.getElementById('laptimer-lap').addEventListener('click', () => {
    if (isRunning) {
        laps.push(time);
        const lapItem = document.createElement('div');
        lapItem.classList.add('lap-item');
        lapItem.innerHTML = `<span>Lap ${laps.length}</span><span>${formatTime(time)}</span>`;
        document.getElementById('lap-list').prepend(lapItem);  // Add new lap to the top
    }
});

// Alarm functionality
let alarmTime;
let alarmTimeout;
const alarmSound = document.getElementById('alarm-sound');

function playAlarmSound() {
    alarmSound.play();
}

function stopAlarmSound() {
    alarmSound.pause();
    alarmSound.currentTime = 0;  // Reset sound
}

document.getElementById('alarm-set').addEventListener('click', () => {
    const input = document.getElementById('alarm-time').value;
    const alarmButton = document.getElementById('alarm-set');
    if (alarmButton.textContent === 'Set Alarm') {
        if (!input) {
            alert('Please set a valid time.');
            return;
        }
        const now = new Date();
        const [hours, minutes] = input.split(':');
        const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        if (alarmDate <= now) {
            alarmDate.setDate(alarmDate.getDate() + 1);
        }
        const timeDiff = alarmDate - now;
        clearTimeout(alarmTimeout);
        alarmTimeout = setTimeout(() => {
            document.getElementById('alarm-display').textContent = 'ALARM!';
            document.getElementById('alarm-display').classList.add('alarm-ringing');
            playAlarmSound();
        }, timeDiff);
        alarmTime = input;
        document.getElementById('alarm-display').textContent = `Alarm set for ${alarmTime}`;
        alarmButton.textContent = 'Cancel Alarm';
    } else {
        clearTimeout(alarmTimeout);
        stopAlarmSound();
        document.getElementById('alarm-display').textContent = '';
        document.getElementById('alarm-display').classList.remove('alarm-ringing');
        alarmButton.textContent = 'Set Alarm';
        alarmTime = null;
    }
});

// Update clock every second
setInterval(() => {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0].slice(0, 5);  // Get HH:MM format
    if (alarmTime && currentTime === alarmTime) {
        document.getElementById('alarm-display').textContent = 'ALARM!';
        document.getElementById('alarm-display').classList.add('alarm-ringing');
        playAlarmSound();
    }
}, 1000);
