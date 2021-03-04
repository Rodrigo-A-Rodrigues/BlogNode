const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

userSchema.plugin(passportLocalMongoose, { usernamefield:'email' });

module.exports = mongoose.model('User', userSchema);