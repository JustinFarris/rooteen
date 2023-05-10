const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.getTasks);
router.get('/start-task', taskController.startTask);
router.get('/unstart-task', taskController.unstartTask);
router.get('/complete-task', taskController.completeTask);
router.get('/snooze-task', taskController.snoozeTask);
router.get('/delete-task', taskController.deleteTask);
router.get('/readd-task', taskController.readdTask);
router.post('/add-task', taskController.addTask);
router.get('/reset-tasks', taskController.resetTasks);
router.get('/edit-task/:taskId', taskController.getEditTask);
router.post('/edit-task', taskController.postEditTask);
router.post('/delete-selected-tasks', (req, res) => {
    console.log('req.body.taskIds:', req.body.taskIds);
    taskController.deleteTasks(req, res);
});



module.exports = router;
