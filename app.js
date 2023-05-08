const express = require('express');
const PORT = process.env.PORT || 3000;
const taskRoutes = require('./routes/taskRoutes');

const app = express();

const schedule = require('node-schedule');
const taskService = require('./services/taskService');

const dailyResetRule = new schedule.RecurrenceRule();
dailyResetRule.hour = 2;
dailyResetRule.minute = 0;

schedule.scheduleJob(dailyResetRule, () => {
  console.log('Performing daily reset');
  taskService.resetDailyTasks();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Add this line

app.set('view engine', 'ejs');

app.use('/', taskRoutes);

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
