const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors')

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

const PORT = config.get('port');

app.use(express.json({ extended: true }));

app.use('/api', require('./routes/task.routes'));

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'));
        app.listen(PORT, () => console.log(`App has been started on ${PORT} port`));

    } catch (error) {
        console.log(`Server error ${error.message}`);
        process.exit(1);
    }
}

start();
