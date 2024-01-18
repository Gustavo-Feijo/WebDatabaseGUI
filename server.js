const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();

//Sets the APP to serve the public directory.
app.use(express.static(path.join(__dirname, 'public')));

//Sends the app html file when entering the site.
app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public','app.html'));
});