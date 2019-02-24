const {validationResult } = require('express-validator/check');

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
    //create post in db
    res.status(201).json({
        message: 'Post created',
        post: {
            _id: new Date().toISOString(), 
            title: title,
            content: content,
            creator: {name: 'Maryam'},
            createdAt: new Date()
        }
    });
}