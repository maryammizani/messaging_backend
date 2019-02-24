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