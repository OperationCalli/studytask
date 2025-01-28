$(document).ready(function () {
    let tasks = [];  // Store tasks
    
    // Add task
    $('#add-task').click(function () {
      let task = $('#new-task').val().trim();
      if (task) {
        tasks.push({ task: task, completed: false });
        console.log('Task added:', task);  // Debugging: Log the task
        updateTaskList();
        $('#new-task').val('');
        updateProgressBar();
        playSound('task-complete'); // Play sound when task is added
      }
    });
  
    // Task checkbox toggle
    $(document).on('change', '.task-checkbox', function () {
      const index = $(this).data('index');
      tasks[index].completed = this.checked;
      updateProgressBar();
      playSound('task-complete'); // Play sound when checking/unchecking
    });
  
    // Delete task
    $(document).on('click', '.delete-task', function () {
      const index = $(this).data('index');
      tasks.splice(index, 1);
      updateTaskList();
      updateProgressBar();
    });
  
    // Update task list with checkboxes and delete button
    function updateTaskList() {
      $('#task-ul').empty();
      tasks.forEach((task, index) => {
        $('#task-ul').append(`
          <li>
            <input type="checkbox" class="task-checkbox" data-index="${index}" ${task.completed ? 'checked' : ''} />
            <span class="task-text">${task.task}</span>
            <button class="delete-task" data-index="${index}">Delete</button>
          </li>
        `);
      });
    }
  
    // Update progress bar based on completed tasks
    function updateProgressBar() {
      const completedTasks = tasks.filter(task => task.completed).length;
      const progress = (completedTasks / tasks.length) * 100;
      $('#progress-bar').css('width', progress + '%');
  
      if (progress === 100) {
        playSound('victory'); // Play victory sound when all tasks are completed
        showVictoryMessage();
      }
    }
  
    // Play sound (either task-complete or victory)
    function playSound(type) {
      let sound;
      if (type === 'task-complete') {
        sound = new Audio('static/sounds/task-complete.wav'); // Path to task complete WAV file
      } else if (type === 'victory') {
        sound = new Audio('static/sounds/victory.wav'); // Path to victory WAV file
      }
      sound.play();
    }
  
    // Show "VICTORY" message for 7 seconds
    function showVictoryMessage() {
      $('#victory-message').show();
      setTimeout(function () {
        $('#victory-message').hide();
        tasks = []; // Clear tasks after victory
        updateTaskList();
        updateProgressBar(); // Reset progress bar
      }, 7000);
    }
  });
  