const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const feedRoutes = require('./routes/feed');
const app = express();

const key = require('./key');
const MONGODB_URI = key.MONGODB_URI;

//app.use(bodyParser.urlencoded()); /// x-www-form-urlencoded <form>
app.use(bodyParser.json());  //application/json

// Serve the images staticlly
// All the req starting with /images, will go through this middleware
// __dirname: path to the dir were this file is located
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
    // set all the domains that should be able to access our server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTION');
    // set all the headers that should be allowed
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
    next();
});

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({  message: message });
});

mongoose.connect(MONGODB_URI + '?retryWrites=true', { useNewUrlParser: true } )
.then(result => {
    app.listen(8080);
})
.catch(err => console.log(err));

