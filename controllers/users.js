const User = require('../models/User');
const multer = require('multer');
const uploadAvatar = multer({ dest: 'uploads/avatars/' });
const fs = require('fs');
const path = require('path');

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
        const userId = req.body._id;
        const info = {
            username: req.body.username,
            email: req.body.email,
            currentPassword: req.body.currentPassword,
            newPassword: req.body.password
        };

        User.updateProfile(info, userId, db)
            .then(user => {
                res.status(200).send(user);
            })
            .catch(code => {
                if (code == 400 || code == 409) {
                    res.sendStatus(code);
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