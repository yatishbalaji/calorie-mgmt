/**
 * @model gener
 */

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { JWT_KEY, SALT } = require('../../config/environment');

const Schema = mongoose.Schema;

const options = {
    versionKey : false,
};

async function hashPassword(pass) {
    return crypto.createHash('md5')
        .update(SALT + pass)
        .digest('hex');
}

const IntakeSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    name: { type: String },
    calories: { type: Number },
    created_on: { type: Date, default: Date.now },
    deleted_on: { type: Date, default: null },
});

const UserSchema = new Schema({
    name: { type : String },
    email: { type : String },
    password: { type : String },
    type: { type : String, default: null },
    max_calories: { type: Number, default: null },
    intakes: [ IntakeSchema ],
	created_on: { type : Date, default: Date.now },
}, options);

UserSchema.pre('save', async function(next) {
    const hashedPass = await hashPassword(this.password);
    this.password = hashedPass;
    next();
});

UserSchema.methods.generateToken = async function() {
    const user = this;
    
    return jwt.sign({ _id: user._id }, JWT_KEY);
}

UserSchema.statics.findByCredential = async (email, pass) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid Credentials');
    }

    const hashedPass = await hashPassword(pass);

    if (hashedPass !== user.password) {
        throw new Error('Invalid Credentials');
    }

    return user;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;