const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const tasksFile = 'tasks.json';
const tasksFilePath = 'tasks.json';

if (!fs.existsSync(tasksFile)) {
    const defaultTasks = [
        { id: 1, name: 'Brush your teeth', status: 'UNSTARTED', class: 'DEFAULT' },
        { id: 2, name: 'Take your meds', status: 'UNSTARTED', class: 'DEFAULT' },
        { id: 3, name: 'Drink water', status: 'UNSTARTED', class: 'DEFAULT' },
        { id: 4, name: 'Exercise', status: 'UNSTARTED', class: 'DEFAULT' }
    ];
    fs.writeFileSync(tasksFile, JSON.stringify(defaultTasks));
}

function saveTasksToFile(tasks, callback) {
  fs.writeFile(tasksFilePath, JSON.stringify(tasks), (err) => {
    if (err) {
      console.error('Error writing tasks to file:', err);
      callback(err);
    } else {
      console.log('Tasks saved to file');
      callback(null);
    }
  });
}

app.get('/', (req, res) => {
    const tasksData = JSON.parse(fs.readFileSync(tasksFile));
    const { tasks, archivedTasks } = prepareTasks(tasksData);
    res.render('index', { tasks, archivedTasks });
});

app.get('/admin', (req, res) => {
  loadTasksFromFile((err, tasks) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error loading tasks');
      return;
    }
    res.render('admin', { tasks: tasks });
  });
});

app.get('/admin/edit-task/:taskId', (req, res) => {
  const taskId = Number(req.params.taskId);

  loadTasksFromFile((err, tasks) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error loading tasks');
      return;
    }

    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      res.status(404).send('Task not found');
      return;
    }

    res.render('edit-task', { task: task });
  });
});

app.post('/admin/save-task', (req, res) => {
  const taskId = Number(req.body.id);
  const updatedTask = {
    id: taskId,
    name: req.body.name,
    status: req.body.status,
    class: req.body.class,
  };

  console.log('Updated Task:', updatedTask);

  loadTasksFromFile((err, tasks) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error loading tasks');
      return;
    }

    console.log('Tasks:', tasks);

    const taskIndex = tasks.findIndex(t => t.id === taskId);
    console.log('Task index:', taskIndex);

    if (taskIndex === -1) {
      res.status(404).send('Task not found');
      return;
    }

    tasks.splice(taskIndex, 1, updatedTask);
    saveTasksToFile(tasks, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving tasks');
        return;
      }
      res.redirect('/admin');
    });
  });
});
 
app.post('/add-task', (req, res) => {
    const taskName = req.body.taskName;
    
    if (taskName && taskName.trim() !== '') {
        let tasks = JSON.parse(fs.readFileSync(tasksFile));
        const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0);
        const newTask = {
            id: maxId + 1,
            name: taskName.trim(),
            status: 'UNSTARTED',
            class: 'CUSTOM'
        };
        tasks.push(newTask);
        fs.writeFileSync(tasksFile, JSON.stringify(tasks));
    }
    res.redirect('/');
});

app.get('/delete-task', (req, res) => {
    const taskId = parseInt(req.query.taskId);

    if (taskId) {
        let tasks = JSON.parse(fs.readFileSync(tasksFile));
        tasks = tasks.filter(task => task.id !== taskId);
        fs.writeFileSync(tasksFile, JSON.stringify(tasks));
    }

    res.redirect('/');
});

app.get('/action', (req, res) => {
    const taskId = parseInt(req.query.taskId);

    if (taskId) {
        let tasks = JSON.parse(fs.readFileSync(tasksFile));
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                if (task.status === 'UNSTARTED') {
                    task.status = 'STARTED';
                } else if (task.status === 'STARTED') {
                    task.status = 'COMPLETE';
                } else if (task.status === 'COMPLETE') {
                    task.status = 'UNSTARTED';
                }
            }
            return task;
        });
        fs.writeFileSync(tasksFile, JSON.stringify(tasks));
    }

    res.redirect('/');
});

app.get('/readd-task', (req, res) => {
    const taskId = parseInt(req.query.taskId);

    if (taskId) {
        let tasks = JSON.parse(fs.readFileSync(tasksFile));
        tasks = tasks.map(task => {
            if (task.id === taskId && task.class === 'ARCHIVED') {
                task.class = 'CUSTOM';
            }
            return task;
        });
        fs.writeFileSync(tasksFile, JSON.stringify(tasks));
    }

    res.redirect('/');
});

// Add this function to your existing code in app.js
function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function addTask(name) {
  tasks.push({
    id: generateUniqueId(),
    name: name,
    status: 'UNSTARTED',
    class: 'CUSTOM',
  });
}

function loadTasksFromFile(callback) {
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found, return an empty list of tasks
        callback(null, []);
      } else {
        callback(err);
      }
      return;
    }

    try {
      const tasks = JSON.parse(data);
      callback(null, tasks);
    } catch (parseErr) {
      callback(parseErr);
    }
  });
}

function prepareTasks(tasksData) {
const tasks = [];
const archivedTasks = [];
tasksData.forEach(task => {
    const action = task.status === 'UNSTARTED' ? 'START' : task.status === 'STARTED' ? 'COMPLETE' : 'RESET';
    const color = task.status === 'UNSTARTED' ? (task.class === 'DEFAULT' ? 'red' : 'blue') : task.status === 'STARTED' ? 'orange' : 'green';

    if (task.class === 'ARCHIVED') {
        archivedTasks.push({ ...task });
    } else {
        tasks.push({ ...task, action, color });
    }
});

return { tasks, archivedTasks };
}

/* I think this is unused, delete it
function reset() {
  tasks.forEach(task => {
    if (task.class === 'DEFAULT') {
      task.status = 'UNSTARTED';
    } else if (task.class === 'CUSTOM') {
      task.class = 'ARCHIVED';
    }
  });
}
*/

function resetTasks() {
  let tasks = JSON.parse(fs.readFileSync(tasksFile));
  tasks = tasks.map(task => {
    if (task.class === 'DEFAULT') {
      task.status = 'UNSTARTED';
    } else if (task.class === 'CUSTOM') {
        task.class = 'ARCHIVED';
    }
  return task;
  });
  fs.writeFileSync(tasksFile, JSON.stringify(tasks));
}

cron.schedule('0 2 * * *', () => {
resetTasks();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});
