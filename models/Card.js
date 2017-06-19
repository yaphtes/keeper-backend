const ObjectId = require('mongodb').ObjectID;

class Card {
    constructor(props) {
        this.userId = ObjectId(props.userId);
        this.title = props.title || '';
        this.text = props.text;
        this.bgColor = props.bgColor;
        this.isFavorited = props.isFavorited;
        this.isArchived = props.isArchived;
        this.isDeleted = props.isDeleted;
    }

    static update(id, card, db) {
        return new Promise((resolve, reject) => {
            db.collection('cards').findOneAndUpdate({ _id: ObjectId(id) }, {
                $set: {
                    title: card.title,
                    text: card.text,
                    bgColor: card.bgColor,
                    isFavorited: card.isFavorited
                }
            }).then(resolve).catch(reject);
        });
    }

    static changeBgColor(id, color, db) {
        return new Promise((resolve, reject) => {
            db.collection('cards').findOneAndUpdate({ _id: ObjectId(id) }, {
                $set: { bgColor: color }
            }).then(resolve).catch(reject);
        });
    }

    static add(card, db) {
        return new Promise((resolve, reject) => {
            db.collection('cards').insertOne(card)
                .then(result => resolve(card))
                .catch(reject);
        });
    }

    static toggle(id, db) {
        return new Promise((resolve, reject) => {
            db.collection('cards').findOne({ _id: ObjectId(id) })
                .then(card => {
                    let isFavorited = card.isFavorited;
                    db.collection('cards').updateOne({ _id: ObjectId(id) }, {
                        $set: { isFavorited: !isFavorited }
                    }).then(resolve);
                }).catch(reject);
        });
    }

    static toTrash(id, db) {
        return new Promise((resolve, reject) => {
            db.collection('cards').findOneAndUpdate({ _id: ObjectId(id) }, {
                $set: { isArchived: false, isDeleted: true }
            }).then(resolve).catch(reject);
        });
    }

    static toArchive(id, db) {
        return new Promise((resolve, reject) => {
            db.collection('cards').findOneAndUpdate({ _id: ObjectId(id) }, {
                $set: { isArchived: true, isDeleted: false }
            }).then(resolve).catch(reject);
        });
    }

    static toHome(id, db) {
        return new Promise((resolve, reject) => {
            db.collection('cards').findOneAndUpdate({ _id: ObjectId(id) }, {
                $set: { isArchived: false, isDeleted: false }
            }).then(resolve).catch(reject);
        });
    }

    static deleteForever(id, db) {
        return new Promise((resolve, reject) => {
            db.collection('cards').findOneAndDelete({ _id: ObjectId(id) })
                .then(resolve)
                .catch(reject);
        });
    }
}

module.exports = Card;