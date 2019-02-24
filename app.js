const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');
const app = express();

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

app.listen(8080);