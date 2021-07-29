const express = require('express');
const router = express.Router();

const { addContact, subscribeContact } = require('../controllers/audience');

router.post('/', addContact);
router.post('/subscribe', subscribeContact);

module.exports = router;