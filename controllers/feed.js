const {validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: '1',
            title: 'first post', 
            content: 'This is the first post',
            imageUrl: 'images/t.JPG',
            creator: {
                name: 'Maryam'
            }, 
            createdAt: new Date()
        }]
    });
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);  // The validation errors that were gathered in routes are saved here
    if(!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed, entered data is incorrect.',
            errors: errors.array()
        });
    }
    const title = req.body.title;
    const content = req.body.content;

    // Create the post in DB
    const post = new Post({
        // _id will be automatically created by mongoose
        //  createdAt: timestamp will be automatically created by mongoose
        title: title,
        content: content,
        imageUrl: 'images/t.jpg',
        creator: {name: 'Maryam'}            
    });
    post.save() // Saves the model in the DB
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Post created',
            post: result
        });
    })
    .catch(err => {
        console.log(err);
    });
}