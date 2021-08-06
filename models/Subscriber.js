const mongoose = require('mongoose');
const moment = require('moment-timezone');

const SubscriberSchema = new mongoose.Schema({
    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },

    subscribed: {
        type: Boolean,
        default: false
    },

    subscriptionDate: {
        type: Date
    },

    createdAt: {
        type: Date,
        default: moment(Date.now()).tz('Africa/Bangui')
    }
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);