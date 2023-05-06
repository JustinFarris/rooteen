const taskService = require('../services/taskService');

exports.getTasks = (req, res) => {
  const tasks = taskService.readTasksFromFile();
  const archivedTasks = tasks.filter(task => task.class === 'ARCHIVED');
  const sections = [
    {
      title: 'Unstarted Tasks',
      filter: task => task.status === 'UNSTARTED' && task.class !== 'ARCHIVED',
    },
    {
      title: 'Started Tasks',
      filter: task => task.status === 'STARTED' && task.class !== 'ARCHIVED',
    },
    {
      title: 'Completed Tasks',
      filter: task => task.status === 'COMPLETED' && task.class !== 'ARCHIVED',
    },
  ];
  res.render('index', { sections, archivedTasks, tasks });
};

exports.startTask = (req, res) => {
  const taskId = parseInt(req.query.taskId, 10);
  let tasks = taskService.readTasksFromFile();
  tasks.forEach(task => {
    if (task.id === taskId) {
      task.status = 'STARTED';
    }
  });
  taskService.saveTasksToFile(tasks);
  res.redirect('/');
};

exports.completeTask = (req, res) => {
  const taskId = parseInt(req.query.taskId, 10);
  let tasks = taskService.readTasksFromFile();
  tasks.forEach(task => {
    if (task.id === taskId) {
      task.status = 'COMPLETED';
    }
  });
  taskService.saveTasksToFile(tasks);
  res.redirect('/');
};

exports.addTask = (req, res) => {
  res.render('add-task');
};

exports.saveTask = (req, res) => {
  const newTask = {
    id: taskService.generateId(),
    name: req.body.taskName,
    status: 'UNSTARTED',
    class: req.body.taskClass || 'CUSTOM',
    dateAdded: new Date().toISOString().split('T')[0]
  };

  const tasks = taskService.readTasksFromFile();
  tasks.push(newTask);
  taskService.saveTasksToFile(tasks);

  res.redirect('/');
};

exports.deleteTask = (req, res) => {
  const taskId = parseInt(req.query.taskId, 10);
  let tasks = taskService.readTasksFromFile();
  tasks = tasks.filter(task => task.id !== taskId);
  taskService.saveTasksToFile(tasks);

  res.redirect('/');
};

exports.readdTask = (req, res) => {
  const taskId = parseInt(req.query.taskId, 10);
  let tasks = taskService.readTasksFromFile();
  tasks.forEach(task => {
    if (task.id === taskId) {
      task.class = 'CUSTOM';
    }
  });
  taskService.saveTasksToFile(tasks);

  res.redirect('/');
};

