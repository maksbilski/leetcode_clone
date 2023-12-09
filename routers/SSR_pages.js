const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/register', (req, res) => {
    res.status(200).sendFile('registration.html', {root: path.join(__dirname, '..', 'public', 'register') });
    });
   
router.get('/login', (req, res) => {
    res.status(200).sendFile('login.html', {root: path.join(__dirname, '..', 'public', 'login') });
    });
   
router.get('/help', (req, res) => {
    res.status(200).sendFile('help.html', {root: path.join(__dirname, '..', 'public', 'help') });
    });
   
router.get('/statistics', (req, res) => {
     res.status(200).sendFile('statistics.html', {root: path.join(__dirname, '..', 'public', '/statistics') });
    });

router.get('/', (req, res) => {
    console.log('homepage')
    res.status(200).sendFile('homepage.html', { root: path.join(__dirname, '..', 'public') });
    });
       
router.get('/exercises', (req, res) => {
    console.log('exercises')
    res.sendFile(path.join(__dirname, '..', 'public', 'exercises', 'exercises.html'));
    });

router.get('/exercises/:exercise_id', (req, res) => {
    console.log('exercise_page')
    res.sendFile(path.join(__dirname, '..', 'public', 'exercises', 'exercise_page.html'));
    });


module.exports = router