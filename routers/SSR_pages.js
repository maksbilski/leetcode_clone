const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/register', (req, res) => {
    res.status(200).sendFile('registration.html', {root: path.join(__dirname, '..', 'public', 'register') });
    });
   
router.get('/login', (req, res) => {
    res.status(200).sendFile('login.html', {root: path.join(__dirname, '..', 'public', 'login') });
    });
   
router.get('/profile', (req, res) => {
    res.status(200).sendFile('profile.html', {root: path.join(__dirname, '..', 'public', 'profile') });
    });

router.get('/profile/:user_id', (req, res) => {
    res.status(200).sendFile('profile.html', {root: path.join(__dirname, '..', 'public', 'profile') });
    });
   
router.get('/statistics', (req, res) => {
     res.status(200).sendFile('statistics.html', {root: path.join(__dirname, '..', 'public', 'statistics') });
    });

router.get('/', (req, res) => {
    res.status(200).sendFile('homepage.html', { root: path.join(__dirname, '..', 'public') });
    });
       
router.get('/exercises', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'exercises', 'exercises.html'));
    });

router.get('/exercises/:exercise_id', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'exercises', 'exercise_page.html'));
    });

router.get('/help', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'help', 'help.html'));
    });

module.exports = router