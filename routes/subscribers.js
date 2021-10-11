const express = require('express');
const router = express.Router();

const { addContact, subscribeContact } = require('../controllers/subscribers');

router.post('/', addContact);
router.post('/subscribe', subscribeContact);

module.exports = router;