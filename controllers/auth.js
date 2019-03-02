const {validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const key = require('../key');
const JWT_SECRET = key.JWT_SECRET;

exports.signup = (req, res, next) => {

    // Check the validation errors that were gathered in routes
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    bcrypt.hash(password, 12)  // salt(strength)=12
    .then(hashedPw => {
        const user = new User({
            email: email,
            password: hashedPw,
            name: name
        });
        return user.save();  
    })
    .then(result => {
        res.status(201).json({message: 'User created', userId: result._id})
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
    .then(user => {
        if(!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        if(!isEqual) {
            const error = new Error('Wrong password');
            error.statusCode = 401;
            throw error;
        }

        // jwt.sign() creates a new signature and packs that into a new json web token. 
        // we can add any data into the token (user email ,... )
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
            }, 
            JWT_SECRET, 
            {expiresIn: '1h'}  // configure the token to expire in 1 hour
        ); 
        res.status(200).json({
            token: token, 
            userId: loadedUser._id.toString()
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}



