const express = require('express');
const router = express.Router();

const { addContact, subscribeContact, checkAddContact } = require('../controllers/audience');

router.post('/', addContact);
router.post('/subscribe', subscribeContact);
router.post('/addContact', checkAddContact);

module.exports = router;