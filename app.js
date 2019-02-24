const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const app = express();

const key = require('./key');
const MONGODB_URI = key.MONGODB_URI;

//app.use(bodyParser.urlencoded()); /// x-www-form-urlencoded <form>
app.use(bodyParser.json());  //application/json

app.use((req, res, next) => {
    // set all the domains that should be able to access our server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTION');
    // set all the headers that should be allowed
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
    next();
});

app.use('/feed', feedRoutes);

mongoose.connect(MONGODB_URI + '?retryWrites=true', { useNewUrlParser: true } )
.then(result => {
    app.listen(8080);
})
.catch(err => console.log(err));

