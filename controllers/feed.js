const fs = require('fs');
const path = require('path');
const {validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post.find().countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find()
        .skip((currentPage -1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
        res.status(200).json({
            message: 'Fetched posts',
            posts: posts,
            totalItems: totalItems
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

    // Check validation errors that were gathered in routes 
    const errors = validationResult(req);  
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

exports.updatePost = (req, res, next) => {

    // Check validation errors that were gathered in routes 
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;  // If no new file is added, the previoud path is used
    if(req.file) {   // If user enters a new file to replace the old one
        imageUrl = req.file.path;
        if(process.platform === "win32")
        {
            imageUrl = imageUrl.replace("\\" ,"/");
        }
    }
    if(!imageUrl) {
        const error = new Error('No file picked.');
        error.statusCode
    }

    // Update the post in DB
    Post.findById(postId)
    .then(post => {
        if(!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        if(!imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Post updated!',
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

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if(!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        // checked logged in user
        clearImage(post.imageUrl);
        return Post.findByIdAndRemove(postId);      
    })
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Deleted post.',           
        })
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });    
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));  //Asynchronously removes the file
}