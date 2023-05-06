const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.getTasks);
router.get('/start-task', taskController.startTask);
router.get('/complete-task', taskController.completeTask);

// Add any other route handlers you have, e.g., for adding, deleting, and re-adding tasks:
router.get('/add-task', taskController.addTask);
router.post('/add-task', taskController.saveTask);
router.get('/delete-task', taskController.deleteTask);
router.get('/readd-task', taskController.readdTask);
router.get('/unstart-task', taskController.unstartTask);
router.post('/snooze-task', taskController.snoozeTask);

module.exports = router;

