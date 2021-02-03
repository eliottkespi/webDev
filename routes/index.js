const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../config/auth');


// Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Home Page
router.get('/home', ensureAuthenticated, (req, res) =>
    res.render('home', {
        name: req.user.name
    }));

module.exports = router;