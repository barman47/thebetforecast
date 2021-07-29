const express = require('express');
const cors = require('cors');
const colors = require('colors');
const secure = require('express-force-https');
const dotenv = require('dotenv');
const path = require('path');

const audience = require('./routes/audience');

const PORT = process.env.PORT || 5000;
const publicPath = path.resolve(__dirname, 'client', 'build');

// Load environment variables via config.env if in development
dotenv.config({ path: './config/config.env' });

const app = express();

app.use(secure);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

app.use('/audience', audience);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(publicPath));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(publicPath, 'index.html'));
    });
}

const server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(err)
    console.log(`Error: ${err.message}`.red);
    // Close server and exit process
    server.close(() => process.exit(10));
});