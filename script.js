let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let message = document.getElementById("message");
let taskCount = document.getElementById("taskCount");
let completedCount = document.getElementById("completedCount");
let taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounters() {
    taskCount.textContent = tasks.length;

    let completed = tasks.filter(task => task.completed).length;
    completedCount.textContent = completed;
}

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        let li = document.createElement("li");

        let taskSpan = document.createElement("span");
        taskSpan.textContent = task.text;
        taskSpan.classList.add("task-title");

        if (task.completed) {
            taskSpan.classList.add("completed");
        }

        let date = document.createElement("small");
        date.textContent = "Created: " + task.date;
        date.classList.add("task-date");

        let noteLabel = document.createElement("label");
        noteLabel.textContent = "📝 Notes";
        noteLabel.classList.add("note-label");

        let noteInput = document.createElement("input");
        noteInput.type = "text";
        noteInput.placeholder = "Write your note here...";
        noteInput.value = task.note;
        noteInput.classList.add("note-input");

        noteInput.addEventListener("input", function () {
            tasks[index].note = noteInput.value;
            saveTasks();
        });

        let completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed
            ? "↩ Undo"
            : "✓ Complete";

        completeBtn.classList.add("complete-btn");

        completeBtn.addEventListener("click", function () {

            tasks[index].completed = !tasks[index].completed;

            saveTasks();
            renderTasks();
        });

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑 Delete";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", function () {

            tasks.splice(index, 1);

            saveTasks();
            renderTasks();

            message.textContent = "Task Deleted Successfully";
        });

        li.appendChild(taskSpan);
        li.appendChild(document.createElement("br"));

        li.appendChild(date);
        li.appendChild(document.createElement("br"));
        li.appendChild(document.createElement("br"));

        li.appendChild(noteLabel);
        li.appendChild(noteInput);

        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    updateCounters();
}

function addTask() {

    let taskText = taskInput.value.trim();

    if (taskText === "") {
        message.textContent = "Please Enter New Task!";
        return;
    }

    let duplicate = tasks.some(
        task => task.text.toLowerCase() === taskText.toLowerCase()
    );

    if (duplicate) {
        message.textContent = "Task Already Exists!";
        return;
    }

    let task = {
        text: taskText,
        completed: false,
        note: "",
        date: new Date().toLocaleString()
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    message.textContent = "Task Added Successfully";
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

renderTasks();