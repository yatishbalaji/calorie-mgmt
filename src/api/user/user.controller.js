const _ = require('lodash');
const moment = require('moment');
const { ObjectId } = require('mongoose').Types;

const UserModel = require('./user.model');

async function create(req, res, next) {
    try {
        const { email, password, name, type } = req.body;
        const lEmail = email.toLowerCase();
 
        const count = await UserModel.count({
            email: lEmail,
        });

        if (count) {
            return res.status(412).json({ message: 'User already exists.' });
        }
        
        await UserModel.create({
            email: lEmail,
            password,
            name,
            type,
            max_calories: 0,
            intakes: [],
        });

        return res.sendStatus(201);
    } catch (err) {
        return next(err);
    }
}

async function login(req, res, next) {
    try {
        if (req.method !== 'POST' ||
            !req.is('application/x-www-form-urlencoded')) {
            return res.status(400).json({
                message:
                'Method must be POST with application/x-www-form-urlencoded encoding',
            });
        }

        const { email, password } = req.body;

        const user = await UserModel.findByCredential(email.toLowerCase(), password);

        const token = await user.generateToken();

        return res.json({ token, user: _.pick(user, ['email', 'name'])});
    } catch (err) {
        return next(err);
    }
}

async function getIntakes(req, res, next) {
    try {
        const reqUser = req.user;
  
        // const match = {
        //     'intakes.deleted_on': null,
        //     _id: reqUser.type === 'admin' ? undefined : reqUser._id,
        // };

        const findQuery = [
            { $unwind :'$intakes'},
            { $match : {
                'intakes.deleted_on': null,
                _id: reqUser._id,
            }},
            {
                $project : {
                    _id : '$intakes._id',
                    name : '$intakes.name',
                    calories : '$intakes.calories',
                    created_on : '$intakes.created_on',
                },
            },
        ]

        // const findQuery = [
        //     { $unwind :'$intakes'},
        //     { $match : {'intakes.deleted_on': null, _id: reqUser._id }},
        //     { $group: {
        //         _id: { $dateToString: { format: "%Y-%m-%d", date: "$intakes.created_on" } },
        //         count: { $sum: 1 },
        //     } },
        //     {
        //         $project : {
        //             _id : 1,
        //             count: 1,
        //             'intake.groupId': '$intakes.groupId',
        //             'intake.name' : '$intakes.name',
        //             'intake.calories' : '$intakes.calories',
        //             // _id : '$intakes._id',
        //         },
        //     },
        // ]
        
        const [intakes, userSetting] = await Promise.all([
            UserModel.aggregate(findQuery),
            UserModel.findOne({
                _id: reqUser._id
            }).select({
                _id : 0,
                max_calories: 1,
            }),
        ]);

        return res.json({
            userSetting,
            intakes,
            totalCalMap: intakes
                .reduce((acc, x) => {
                    const dateStr = moment(x.created_on).format('DD-MM-YYYY');
                    Object.assign(acc, {
                        [dateStr]: (acc[dateStr] || 0) + x.calories,
                    });

                    return acc;
                }, {}),
        });
    } catch (err) {
        return next(err);
    }
}

async function addIntake(req, res, next) {
    try {
        const reqUser = req.user;

        const {
            name, calories, created_on
        } = req.body;

        if (!name || !calories || !created_on) {
            return res.status(412).json({ message: 'Required fields missing' });
        }

        const objId = new ObjectId();

        await UserModel.updateOne({
            _id: new ObjectId(reqUser._id),
        }, {
            $push: {
                intakes: {
                    _id: objId,
                    name, calories,
                    created_on,
                }
            },
        });

        return res.json({
            _id: objId,
        });
    } catch (err) {
        return next(err);
    }
}

async function updateIntake(req, res, next) {
    try {
        const reqUser = req.user;
        const { id: intakeId } = req.params;

        const {
            name, calories, created_on,
        } = req.body;

        if (!name || !calories|| !created_on ) {
            return res.status(412).json({ message: 'Required fields missing' });
        }

        await UserModel.updateOne({
            _id: new ObjectId(reqUser._id),
            "intakes._id": intakeId,
        }, {
            $set: {
                "intakes.$.name": name,
                "intakes.$.calories": calories,
                "intakes.$.created_on": created_on,
            }
        });

        return res.sendStatus(204);
    } catch (err) {
        return next(err);
    }
}

async function updateSetting(req, res, next) {
    try {
        const reqUser = req.user;

        const {
            max_calories
        } = req.body;

        if (!max_calories) {
            return res.status(412).json({ message: 'Required fields missing' });
        }

        await UserModel.updateOne({
            _id: new ObjectId(reqUser._id),
        }, {
            $set: {
                max_calories
            },
        });

        return res.sendStatus(204);
    } catch (err) {
        return next(err);
    }
}

async function deleteIntake(req, res, next) {
    try {
        const reqUser = req.user;
        const { id: intakeId } = req.params;

        if (!intakeId) {
            return res.status(412).json({ message: 'Required fields missing' });
        }

        await UserModel.updateOne({
            _id: new ObjectId(reqUser._id),
            "intakes._id": new ObjectId(intakeId),
        }, {
            $set: {
                "intakes.$.deleted_on": new Date()
            }
        });

        return res.sendStatus(204);
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    create,
    login,
    getIntakes,
    addIntake,
    updateIntake,
    deleteIntake,
    updateSetting
};
