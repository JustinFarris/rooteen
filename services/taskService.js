const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, '..', 'data', 'tasks.json');

function initializeTasksFile() {
  if (!fs.existsSync(tasksFilePath)) {
    const initialTasks = [
      {
        id: 1,
        name: "Task 1",
        status: "UNSTARTED",
        class: "CUSTOM",
        dateAdded: new Date().toISOString().split("T")[0],
      },
    ];
    fs.writeFileSync(tasksFilePath, JSON.stringify(initialTasks, null, 2));
  }
}

function readTasksFromFile() {
  initializeTasksFile();
  const tasksData = fs.readFileSync(tasksFilePath, 'utf8');
  return JSON.parse(tasksData);
}

function saveTasksToFile(tasks) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
}

function generateId() {
  const tasks = readTasksFromFile();
  const maxId = tasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
  return maxId + 1;
}

module.exports = {
  initializeTasksFile,
  readTasksFromFile,
  saveTasksToFile,
  generateId,
};

