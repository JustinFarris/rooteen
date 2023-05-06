const fs = require('fs');
const taskService = require('../services/taskService');

if (!fs.existsSync('tasks.json')) {
  taskService.initializeTasksFile();
}

