const express = require('express');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use('/', taskRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

