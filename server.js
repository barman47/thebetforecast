const express = require('express');
const cors = require('cors');
const colors = require('colors');
const secure = require('express-force-https');
const { CronJob } = require('cron');
const dotenv = require('dotenv');
// const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const path = require('path');

const audience = require('./routes/audience');

const connectDB = require('./config/db');
const { checkContacts } = require('./controllers/audience');

const PORT = process.env.PORT || 5000;
const publicPath = path.resolve(__dirname, 'client', 'build');

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes 
    max: 100
});

// Load environment variables via config.env if in development
dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(secure);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

// app.use(helmet());
app.disable('x-powered-by');
app.use(hpp());
app.use(mongoSanitize())
app.use(limiter);

app.use('/audience', audience);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(publicPath));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(publicPath, 'index.html'));
    });
}

const job = new CronJob('0 0 0 * * *', checkContacts, null, true, 'Africa/Bangui');
job.start();

checkContacts();

const server = app.listen(PORT, () => console.log(`Server running is ${process.env.NODE_ENV} on port ${PORT}. . . `));

// const oneDay = 86400000; // One day in milliseconds

// setInterval(() => {
//     console.log('This will run every day');
// }, oneDay);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(err)
    console.log(`Error: ${err.message}`.red);
    // Close server and exit process
    server.close(() => process.exit(10));
});