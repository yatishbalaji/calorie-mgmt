const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;

const UserModel = require('../api/user/user.model');
const { JWT_KEY } = require('../config/environment');

async function authenticate(req, res, next) {
    try {
        const token = (req.header('Authorization') || '')
            .replace('Bearer ', '');

        if (!token) return res.sendStatus(401);

        const data = jwt.verify(token, JWT_KEY);
        
        let user = await UserModel.findOne({ _id: data._id });

        if (!user) return res.sendStatus(401);

        if (user.type === 'admin' && req.body.user_id) {
            user = await UserModel.findOne({ _id: req.body.user_id })
        }

        req.user = user;

        next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(401);
    }
}

module.exports = authenticate;