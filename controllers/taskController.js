const fs = require('fs');
const path = require('path');
const tasksFilePath = path.join(__dirname, '..', 'data', 'tasks.json');
const tasks = require(tasksFilePath);
const taskService = require('../services/taskService');

const getTasks = (req, res) => {
  const now = new Date();
  const timeDifference = now - startTime;
  const hoursRunning = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutesRunning = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const sections = getSections();
  res.render('index', {
    tasks: tasks,
    sections: sections,
    startTime: startTime,
    hoursRunning: hoursRunning,
    minutesRunning: minutesRunning
  });
};

const getSections = () => {
  return [
    {
      title: 'UNSTARTED',
      tasks: tasks.filter(task => task.status === 'UNSTARTED' && task.class !== 'ARCHIVED')
    },
    {
      title: 'STARTED',
      tasks: tasks.filter(task => task.status === 'STARTED' && task.class !== 'ARCHIVED')
    },
    {
      title: 'COMPLETED',
      tasks: tasks.filter(task => task.status === 'COMPLETED' && task.class !== 'ARCHIVED')
    },
    {
      title: 'ARCHIVED',
      tasks: tasks.filter(task => task.class === 'ARCHIVED'),
      showDeleteSelected: true
    }
  ];
};

const startTask = (req, res) => {
  const taskId = parseInt(req.query.taskId, 10);
  let tasks = taskService.readTasksFromFile();

  tasks = tasks.map(task => {
    if (task.id === taskId) {
      task.status = 'STARTED';
    }
    return task;
  });

  taskService.saveTasksToFile(tasks);
  res.redirect('/');
};

const unstartTask = (req, res) => {
  const taskId = parseInt(req.query.taskId, 10);
  let tasks = taskService.readTasksFromFile();

  tasks = tasks.map(task => {
    if (task.id === taskId) {
      task.status = 'UNSTARTED';
    }
    return task;
  });

  taskService.saveTasksToFile(tasks);
  res.redirect('/');
};

const completeTask = (req, res) => {
  const taskId = parseInt(req.query.taskId, 10);
  let tasks = taskService.readTasksFromFile();

  tasks = tasks.map(task => {
    if (task.id === taskId) {
      task.status = 'COMPLETED';
    }
    return task;
  });

  taskService.saveTasksToFile(tasks);
  res.redirect('/');
};

const snoozeTask = (req, res) => {
  const taskId = parseInt(req.query.taskId, 10);
  let tasks = taskService.readTasksFromFile();

  tasks = tasks.map(task => {
    if (task.id === taskId) {
      task.snoozed = true;
    }
    return task;
  });

  taskService.saveTasksToFile(tasks);
  res.redirect('/');
};

const deleteTask = (req, res) => {
  const taskId = parseInt(req.query.taskId, 10);
  let tasks = taskService.readTasksFromFile();
  tasks = tasks.filter(task => task.id !== taskId);
  taskService.saveTasksToFile(tasks);
  res.redirect('/');
};

const readdTask = (req, res) => {
  const taskId = parseInt(req.query.taskId, 10);
  let tasks = taskService.readTasksFromFile();

  tasks = tasks.map(task => {
    if (task.id === taskId) {
      task.class = 'CUSTOM';
      task.status = 'UNSTARTED';
    }
    return task;
  });

  taskService.saveTasksToFile(tasks);
  res.redirect('/');
};

const addTask = (req, res) => {
  const taskName = req.body.taskName;
  const newTask = {
    id: taskService.generateId(),
    name: taskName,
    status: 'UNSTARTED',
    class: 'CUSTOM',
    dateAdded: new Date().toISOString().split('T')[0],
  };

  const tasks = taskService.readTasksFromFile();
  tasks.push(newTask);
  taskService.saveTasksToFile(tasks);

  res.redirect('/');
};

const resetTasks = (req, res) => {
  taskService.resetDailyTasks();
  res.redirect('/');
};

const getEditTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = tasks.find((t) => t.id === parseInt(taskId));

    if (!task) {
      return res.status(404).send('Task not found');
    }

    res.render('edit-task', { task });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


const postEditTask = (req, res) => {
  const taskId = parseInt(req.body.taskId, 10);
  const taskName = req.body.taskName;
  const taskStatus = req.body.taskStatus;
  const taskClass = req.body.taskClass;
  const taskSnoozed = req.body.taskSnoozed === 'true';

  let tasks = taskService.readTasksFromFile();
  tasks = tasks.map(task => {
    if (task.id === taskId) {
      task.name = taskName;
      task.status = taskStatus;
      task.class = taskClass;
      task.snoozed = taskSnoozed;
    }
    return task;
  });

  taskService.saveTasksToFile(tasks);
  res.redirect('/');
};

const deleteTasks = (req, res) => {
  const taskIdsToDelete = req.body.taskIds;

  console.log('taskIdsToDelete:', taskIdsToDelete);

  if (taskIdsToDelete && Array.isArray(taskIdsToDelete)) {
    const taskIdsToDeleteInt = taskIdsToDelete.map(taskId => parseInt(taskId));
    let updatedTasks = tasks.filter((task) => !taskIdsToDeleteInt.includes(task.id));
    taskService.saveTasksToFile(updatedTasks);
  } else {
    console.log('No taskIdsToDelete or not an array');
  }

  res.redirect('/');
};

module.exports = {
  getTasks,
  addTask,
  startTask,
  unstartTask,
  completeTask,
  snoozeTask,
  deleteTask,
  readdTask,
  resetTasks,
  getEditTask,
  postEditTask,
  deleteTasks,
};


