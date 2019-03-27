const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');
const key = require('../key');
const MONGODB_TEST_URI = key.MONGODB_TEST_URI;

describe('Auth Controller', function() {
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

    // beforeEach(function(done) {});
    // afterEach(function(done) {});


    it('should throw an error with code 500 if accessing the database fails', function(done) {
        sinon.stub(User, 'findOne');

        // Fake a fail database access
        User.findOne.throws();
        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        };
        AuthController.login(req, {}, () => {}).then(result => {            
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();  // tells mocha to wait before it treats this testcase as done
        })

        User.findOne.restore();
    })

    it('should send a response with a valid user status for an existing user', function(done) {       
        const req = {userId: '5c8cde6b4e8f9f3ab04c1b3f'}
        const res = {
            status: 500,
            userStatus: null,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.userStatus = data.status;
            }
        };
        AuthController.getUserStatus(req, res, ()=> {})
        .then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new!');
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