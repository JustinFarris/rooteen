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
router.get('/reset-tasks', taskController.resetTasks);

module.exports = router;
