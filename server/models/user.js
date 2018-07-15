const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _= require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});


UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject= user.toObject();

    return _.pick(user, ['_id', 'name']);
};

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, '123');

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
};


UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, '123');
    } catch (e) {
        return Promise.reject();
    }

   return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
   });
};

UserSchema.statics.findByCredentials = async function (name, password) {
    const User = this;
    try {
        const user = await User.findOne({name});
        if (!user) {
            throw new Error; 
        }
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            throw new Error;
        }

        return user;
    } catch (e) {
        return Promise.reject();
    }
};

UserSchema.methods.removeToken = function (token) {
    const user = this;
    
    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

UserSchema.pre('save', function(next) {
    const user = this;

    if (user.isModified('password')){
        
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next()
            });
        });
        
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = {User};