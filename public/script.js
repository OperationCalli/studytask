function markTasks() {
    let totalTasks = document.querySelectorAll('.task').length;
    let completedTasks = 0;

    document.querySelectorAll('.task input').forEach((checkbox) => {
        if (checkbox.checked) {
            completedTasks++;
            // Play completion sound
            playSound();
        }
    });

    let progress = (completedTasks / totalTasks) * 100;
    document.getElementById('progress').style.width = progress + '%';
}

function playSound() {
    var audio = new Audio('/public/completion-sound.mp3');
    audio.play();
}
