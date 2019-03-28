const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');
const key = require('../key');
const MONGODB_TEST_URI = key.MONGODB_TEST_URI;

describe('Feed Controller', function() {
    before(function(done) {
        mongoose.connect(MONGODB_TEST_URI + '?retryWrites=true', { useNewUrlParser: true } )
        .then(result => {
            const user = new User({
                email: 'test@test.com',
                password: 'tester',
                name: 'Test',
                posts: [],
                _id: '5c8cde6b4e8f9f3ab04c1b3f' // user Id has to have a proper format so that  mongoDB can accept it
            });
            return user.save();
        })
        .then(() => {
            done();
        })
    })

    it('should add a created post to the posts of the creator ', function(done) {

        const req = {
            body: {
                title: 'Test Post',
                password: 'tester',
                content: 'A Test Post'
            },
            file: {
                path: 'abc'
            },
            userId: '5c8cde6b4e8f9f3ab04c1b3f'
        };
        const res = {
            status: function() {
                return this;
            },
            json: function() {}
        };
        FeedController.createPost(req, res, () => {}).then(savedUser => {            
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);  
            done();
        })
    })

    after(function(done) {
        User.deleteMany({}).then(() => {
            return mongoose.disconnect();
        })
        .then(() => {
            done();
        })
    })
})