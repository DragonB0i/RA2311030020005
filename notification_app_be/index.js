const express = require('express');
const app = express();

const requestLogger = require('../logging_middleware/requestLogger');
const notificationRoutes = require('./routes/notificationRoutes');

app.use(express.json());

// Middleware logging
app.use(requestLogger);

// Routes
app.use('/notifications', notificationRoutes);

app.listen(3001, () => {
    console.log('Notification service running on port 3001');
});