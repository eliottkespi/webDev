const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');

const User = require('../models/Users');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    errors = [];

    // Check Required Fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill all of the required fields' });
    }

    // Check Passwords Match
    if (password !== password2) {
        errors.push({ msg: 'Passwords don\'t match' });
    }

    // Check Password Length
    if (password.length < 6) {
        errors.push({ msg: 'Password is too short - Minimum is 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Check User Already Registered
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    // Encrypt Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;

                            // Save User
                            newUser.save()
                                .then(user => {
                                    req.flash('successMsg', 'You are now registered');
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        })
                    })
                }
            }
            )
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('successMsg', 'Logged Out');
    res.redirect('/users/login');
});

module.exports = router;