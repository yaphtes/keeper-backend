const User = require('../models/User');
const multer = require('multer');
const uploadAvatar = multer({ dest: 'uploads/avatars/' });
const fs = require('fs');
const path = require('path')

exports.getAvatar = function (app, db) {
    return (req, res) => {
        let url = req.query.url;
        let file = fs.readFile(path.join('uploads', 'avatars', url), (err, data) => {
            if (err) throw err;
            res.send(data);
        });
    };
};

exports.changeAvatar = function (app, db) {
    return (req, res) => {
        let file = req.file;
        let userId = req.body.userId;
        let lastAvatar = req.body.lastAvatar;

        fs.unlink(path.resolve('uploads', 'avatars', lastAvatar), err => {
            if (err) console.log(err);
            console.log(`${lastAvatar} deleted`);

            User.changeAvatar(file, userId, db)
                .then(() => {
                    res.send(file.filename);
                })
                .catch(err => {
                    res.status(500).send(err);
                    console.log(err);
                });
        });

    };
};

exports.updateUserProfile = function (app, db) {
    return (req, res) => {
        let user = new User(req.body);
        let _id = user._id;

        console.log('Will updateUserProfile:\n', user._id);

        User.updateProfile(_id, user, db)
            .then(user => {
                res.status(200).send(user);
            })
            .catch(code => {
                if (code == 400) {
                    res.sendStatus(400);
                } else {
                    res.sendStatus(500);
                }
                console.log('updateUserProfile error:\n', err);
            });
    };
};

exports.postUser = function (app, db) {
    return (req, res) => {
        let user = new User(req.body);

        console.log('Will postUser:\n', user);

        User.insertOne(user, db)
            .then(user => res.status(200).send(user))
            .catch(err => {
                res.status(400).send(err);
                console.log('postUser error:\n', err);
            });
    };
};

exports.login = function (app, db) {
    return (req, res) => {
        let user = new User(req.query);
        let type = req.query.type;

        console.log('Will login:\n', user);
        console.log('Will login type:\n', type);

        User.login(type, user, db)
            .then(user => {
                if (!user) {
                    res.status(404).send();
                } else {
                    res.status(200).send(user);
                }
            })
            .catch(err => {
                res.status(500).send(err);
                console.log('login error:\n', err);
            });
    };
};

exports.getUserByToken = function (app, db) {
    return (req, res) => {
        let token = req.headers.token;

        console.log('Will getUserByToken:\n', token);

        User.getByToken(token, db)
            .then(user => {
                if (!user) {
                    res.status(404).send('User not found');
                } else {
                    console.log(user);
                    User.addCardsToResponseByUserId(user._id, db)
                        .then(cards => {
                            user.cards = cards;
                            res.status(200).send(user);
                        });
                }
            })
            .catch(err => {
                console.log('getUserByToken error:\n', err);
                res.status(404).send(err);
            });
    };
};