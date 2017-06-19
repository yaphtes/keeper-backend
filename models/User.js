const jwtService = require('../services/jwtService');
const ObjectId = require('mongodb').ObjectID;

class User {
    constructor(props) {
        this._id = ObjectId(props._id) || '';
        this.username = props.username;
        this.password = props.password;
        this.email = props.email || '';
        this.avatarUrl = props.avatarUrl || '';
        this.avatarBlob = '';
    }

    static changeAvatar(file, userId, db) {
        return new Promise((resolve, reject) => {
            db.collection('users').findOneAndUpdate({ _id: ObjectId(userId) }, {
                $set: { avatarUrl: file.filename }
            })
            .then(doc => {
                console.log('changed Avatar:\n', doc);
                resolve();
            })
            .catch(reject);
        });
    }

    static updateProfile(id, user, db) {
        let _id = ObjectId(id);

        return new Promise((resolve, reject) => {
            db.collection('users').findOne({ email: user.email })
                .then(doc => {
                    if (doc) {
                        reject(400);
                    } else {
                        db.collection('users').findOneAndUpdate({ _id }, {
                            $set: {
                                username: user.username,
                                password: user.password,
                                email: user.email
                            }
                        })
                            .then(doc => {
                                console.log('updateProfile:\n', doc);
                                resolve(user);
                            })
                            .catch(reject);
                    }
                })
                .catch(reject);
        });
    }

    static insertOne(user, db) {
        return new Promise((resolve, reject) => {
            db.collection('users').findOne({ username: user.username })
                .then(doc => {
                    if (doc) reject(new Error('A user already exists'));

                    return new Promise((resolve, reject) => {
                        db.collection('users').insertOne(user)
                            .then(result => {
                                resolve(user);
                            });
                    });
                })
                .then(user => {
                    jwtService.use(user, db)
                    resolve(user);
                })
                .catch(console.error);
        });
    }

    static login(type, user, db) {
        return new Promise((resolve, reject) => {
            switch (type) {
                case 'username':
                    db.collection('users').findOne({ username: user.username })
                        .then(user => {
                            if (!user) {
                                resolve();
                            } else {
                                jwtService.use(user, db);
                                resolve(user);
                            }
                        })
                        .catch(console.error);
                    break;

                case 'email':
                    db.collection('users').findOne({ email: user.email })
                        .then(user => {
                            jwtService.use(user, db);
                            resolve(user);
                        })
                        .catch(console.error);
                    break;

                default:
                    return Promise.reject('invalid login`s type');
            }
        })
    }

    static getByToken(token, db) {
        let id = jwtService.getUserId(token);

        if (id) {
            return new Promise((resolve, reject) => {
                db.collection('users').findOne({ _id: id })
                    .then(resolve)
                    .catch(console.error);
            })
        } else {
            return Promise.reject('User not found');
        }
    }

    static addCardsToResponseByUserId(id, db) {
        return new Promise((resolve, reject) => {
            let cards = [];

            let cursor = db.collection('cards').find({ userId: ObjectId(id) });
            cursor.forEach(doc => {
                cards.push(doc);
            }, () => resolve(cards));
        });
    }
}

module.exports = User;