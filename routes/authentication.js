const express = require('express');
const passport = require('passport');
const router = express.Router();

// connect-ensure-login Configuration
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

// Display Login Form
router.get('/login', ensureLoggedOut(), (req, res) => {
    res.render('authentication/login');
});

// Handle Submission of Login Form 
router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
    successRedirect     : '/index',
    failureRedirect     : '/login'
}));

// Display Signup Form
router.get('/signup', ensureLoggedOut(), (req, res) => {
    res.render('authentication/signup');
});

// Handle Submission of Signup Form
router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
    successRedirect     : '/index',
    failureRedirect     : '/signup'
}));

// Handle Logout
router.post('/logout', ensureLoggedIn('/login'), (req, res) => {
    req.logout();
    res.render('authentication/login');
});

module.exports = router;