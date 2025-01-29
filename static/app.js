// Import the functions you need from Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBhegc39eQY7-JNrI_yZ8ZfvMSUmxWmw64",
  authDomain: "studitask-2d34c.firebaseapp.com",
  projectId: "studitask-2d34c",
  storageBucket: "studitask-2d34c.firebasestorage.app",
  messagingSenderId: "746671529397",
  appId: "1:746671529397:web:31ecac7c896af093474dfc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Initialize Firestore

// Function to add tasks to Firestore
async function addTask(task) {
    try {
        const docRef = await addDoc(collection(db, "tasks"), {
            task: task,
            completed: false
        });
        console.log("Task added with ID: ", docRef.id);
        updateTaskList(); // Refresh task list after adding
    } catch (e) {
        console.error("Error adding task: ", e);
    }
}

// Function to get tasks from Firestore
async function getTasks() {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasks = [];
    querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
    });
    return tasks;
}

// Function to update task in Firestore
async function updateTaskStatus(taskId, completed) {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
        completed: completed
    });
    updateTaskList(); // Refresh task list after updating
}

// Function to delete task from Firestore
async function deleteTask(taskId) {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
    updateTaskList(); // Refresh task list after deleting
}

$(document).ready(function () {
    let tasks = [];  // Store tasks fetched from Firebase
    
    // Load tasks from Firestore when page loads
    async function loadTasks() {
        tasks = await getTasks();
        updateTaskList();
    }
    loadTasks();  // Call function to load tasks

    // Add task
    $('#add-task').click(function () {
        let task = $('#new-task').val().trim();
        if (task) {
            addTask(task);
            $('#new-task').val('');
            updateProgressBar();
            playSound('task-complete'); // Play sound when task is added
        }
    });

    // Task checkbox toggle
    $(document).on('change', '.task-checkbox', function () {
        const index = $(this).data('index');
        const taskId = tasks[index].id;
        const completed = this.checked;
        tasks[index].completed = completed;
        updateTaskStatus(taskId, completed);  // Update task in Firestore
        updateProgressBar();
        playSound('task-complete'); // Play sound when checking/unchecking
    });

    // Delete task
    $(document).on('click', '.delete-task', function () {
        const index = $(this).data('index');
        const taskId = tasks[index].id;
        deleteTask(taskId);  // Delete task from Firestore
        playSound('task-complete'); // Play sound when task is deleted
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
