const jwtService = require('../services/jwtService');
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcryptjs');

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

    static updateProfile(info, userId, db) {
        const _id = ObjectId(userId);
        return new Promise((resolve, reject) => {
            db.collection('users').findOne({ _id })
                .then(user => {
                    console.log(info.currentPassword, user.password);
                    if (bcrypt.compareSync(info.currentPassword, user.password)) {
                        return db.collection('users').findOne({ email: info.email });
                    } else {
                        reject(409);
                    }
                })
                .then(doc => {
                    if (!doc || doc._id == userId) {
                        bcrypt.genSalt()
                            .then(salt => bcrypt.hash(info.newPassword, salt))
                            .then(hash => db.collection('users').findOneAndUpdate({ _id }, {
                                $set: {
                                    username: info.username,
                                    email: info.email,
                                    password: hash
                                }
                            }))
                            .then(() => resolve({ username: info.username, email: info.email }))
                            .catch(() => reject(500));
                    } else {
                        reject(400);
                    }
                })
                .catch(() => reject(500));
        });
    }

    static insertOne(user, db) {
        return new Promise((resolve, reject) => {
            db.collection('users').findOne({ username: user.username })
                .then(doc => {
                    if (doc) reject(new Error('A user already exists'));

                    return new Promise((resolve, reject) => {
                        bcrypt.genSalt()
                            .then(salt => bcrypt.hash(user.password, salt))
                            .then(hash => {
                                user.password = hash;
                                db.collection('users').insertOne(user)
                                    .then(() => resolve(user));
                            })
                            .catch(console.log);
                    });
                })
                .then(user => {
                    jwtService.use(user, db)
                    resolve(user);
                })
                .catch(console.error);
        });
    }

    static login(type, enteringUser, db) {
        return new Promise((resolve, reject) => {
            if (type == 'username' || type == 'password') {
                db.collection('users').findOne({ [type]: enteringUser.username })
                    .then(user => {
                        if (!user) {
                            resolve();
                        } else {
                            bcrypt.compare(enteringUser.password, user.password)
                                .then(passwordIsValid => {
                                    if (passwordIsValid) {
                                        jwtService.use(user, db);
                                        resolve(user);
                                    } else {
                                        resolve();
                                    }
                                })
                                .catch(console.log);
                        }
                    })
                    .catch(console.error);
            } else {
                reject('invalid login`s type');
            }
        });
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