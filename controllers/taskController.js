const taskService = require('../services/taskService');

exports.getTasks = (req, res) => {
  const tasks = taskService.readTasksFromFile();
  const sections = [
    {
      title: 'Unstarted Tasks',
      filter: task => task.status === 'UNSTARTED' && !task.snoozed && task.class !== 'ARCHIVED',
    },
    {
      title: 'Started Tasks',
      filter: task => task.status === 'STARTED' && !task.snoozed && task.class !== 'ARCHIVED',
    },
    {
      title: 'Completed Tasks',
      filter: task => task.status === 'COMPLETED' && !task.snoozed && task.class !== 'ARCHIVED',
    },
    {
      title: 'Archived Tasks',
      filter: task => task.class === 'ARCHIVED' || task.snoozed,
    },
  ];
  res.render('index', { sections, tasks });
};

exports.getEditTask = (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  const tasks = taskService.readTasksFromFile();
  const task = tasks.find(task => task.id === taskId);

  if (!task) {
    res.status(404).send('Task not found');
    return;
  }

  res.render('edit-task', { task });
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
  const newTask = {
    id: taskService.generateId(),
    name: req.body.taskName,
    status: 'UNSTARTED',
    class: 'CUSTOM',
    dateAdded: new Date().toISOString().split('T')[0]
  };

  const tasks = taskService.readTasksFromFile();
  tasks.push(newTask);
  taskService.saveTasksToFile(tasks);

  res.redirect('/');
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

exports.unstartTask = (req, res) => {
  const taskId = parseInt(req.query.taskId, 10);
  let tasks = taskService.readTasksFromFile();
  tasks.forEach(task => {
    if (task.id === taskId) {
      task.status = 'UNSTARTED';
    }
  });
  taskService.saveTasksToFile(tasks);

  res.redirect('/');
};

exports.snoozeTask = (req, res) => {
  const taskId = parseInt(req.query.taskId, 10);
  if (isNaN(taskId)) {
    res.status(400).send('taskId is required');
    return;
  }

  const tasks = taskService.readTasksFromFile();
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    res.status(404).send('Task not found');
    return;
  }

  tasks[taskIndex].snoozed = true;
  taskService.saveTasksToFile(tasks);

  res.redirect('/');
};

exports.resetTasks = (req, res) => {
  taskService.resetDailyTasks();
  res.redirect('/');
};

exports.updateTask = (req, res) => {
  const taskId = parseInt(req.body.taskId, 10);
  const updatedTask = {
    name: req.body.taskName,
    status: req.body.taskStatus,
    class: req.body.taskClass,
    snoozed: req.body.taskSnoozed === 'true' ? true : false,
  };

  let tasks = taskService.readTasksFromFile();
  tasks.forEach(task => {
    if (task.id === taskId) {
      task.name = updatedTask.name;
      task.status = updatedTask.status;
      task.class = updatedTask.class;
      task.snoozed = updatedTask.snoozed;
    }
  });
  taskService.saveTasksToFile(tasks);

  res.redirect('/');
};

