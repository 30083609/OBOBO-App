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
let time = 100;
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
            time += 1;
            updateDisplay(timerId);
        }, 10);
        button.textContent = 'Stop';
    }
    isRunning = !isRunning;
}
function reset(timerId) {
    clearInterval(interval);
    time = 1500;
    isRunning = false;
    updateDisplay(timerId);
    document.querySelector(`#${timerId}-startstop`).textContent = 'Start';
    if (timerId === 'laptimer') {
        laps = [];
        document.getElementById('lap-list').innerHTML = '';
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
        document.getElementById('lap-list').prepend(lapItem);
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
    alarmSound.currentTime = 0;
}
document.getElementById('alarm-set').addEventListener('click', () => {
    const input = document.getElementById('alarm-time');
    const alarmButton = document.getElementById('alarm-set');
    if (alarmButton.textContent === 'Set Alarm') {
        const now = new Date();
        const [hours, minutes] = input.value.split(':');
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
        alarmTime = input.value;
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
    const currentTime = now.toTimeString().split(' ')[0];
    if (currentTime.startsWith(alarmTime)) {
        document.getElementById('alarm-display').textContent = 'ALARM!';
        document.getElementById('alarm-display').classList.add('alarm-ringing');
        playAlarmSound();
    }
}, 1000);