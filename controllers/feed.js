const {validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post.find()
    .then(posts => {
        res.status(200).json({
            message: 'Fetched posts',
            posts: posts
        })
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);  // The validation errors that were gathered in routes are saved here
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
        // return res.status(422).json({
        //     message: 'Validation failed, entered data is incorrect.',
        //     errors: errors.array()
        // });
    }
    if(!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
    let imageUrl = req.file.path;
    if(process.platform === "win32")
    {
        imageUrl = imageUrl.replace("\\" ,"/");
    }
    const title = req.body.title;
    const content = req.body.content;

    // Create the post in DB
    const post = new Post({
        // _id will be automatically created by mongoose
        //  createdAt: timestamp will be automatically created by mongoose
        title: title,
        content: content,
        imageUrl: imageUrl,
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
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if(!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'Postfetched', post: post });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}