const Card = require('../models/Card');

exports.updateCard = function (app, db) {
    return (req, res) => {
        let card = req.body;
        let { _id } = card;

        Card.update(_id, card, db)
            .then(() => {
                res.status(200).send('ok');
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    };
};

exports.changeBgColor = function (app, db) {
    return (req, res) => {
        let card = req.body;
        let { _id, bgColor } = card;

        Card.changeBgColor(_id, bgColor, db)
            .then(() => {
                res.status(200).send(card);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    }
}

exports.createCard = function (app, db) {
    return (req, res) => {
        let card = new Card(req.body);

        Card.add(card, db)
            .then(insertedCard => {
                res.status(200).send(insertedCard);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    };
};

exports.toggle = function (app, db) {
    return (req, res) => {
        let { id } = req.body;

        Card.toggle(id, db)
            .then(() => {
                res.status(200).send('updated');
            })
            .catch(err => {
                res.status(500).send(err);
                console.log(err);
            });
    };
};

exports.toTrash = function (app, db) {
    return (req, res) => {
        let { id } = req.body;

        Card.toTrash(id, db)
            .then(() => {
                res.status(200).send('trashed');
            })
            .catch(err => {
                res.status(500).send(err);
                console.log(err);
            });
    };
};

exports.toArchive = function (app, db) {
    return (req, res) => {
        let { id } = req.body;

        Card.toArchive(id, db)
            .then(() => {
                res.status(200).send('archived');
            })
            .catch(err => {
                res.status(500).send(err);
                console.log(err);
            });
    };
};

exports.toHome = function (app, db) {
    return (req, res) => {
        let { id } = req.body;

        Card.toHome(id, db)
            .then(() => {
                res.status(200).send('moved to home');
            })
            .catch(err => {
                res.status(500).send(err);
                console.log(err);
            });
    };
};

exports.deleteForever = function (app, db) {
    return (req, res) => {
        let { id } = req.body;

        Card.deleteForever(id, db)
            .then(() => {
                res.status(200).send('deleted');
            })
            .catch(err => {
                res.status(500).send(err);
                console.log(err);
            });
    };
};

exports.makeCopy = function (app, db) {
    return (req, res) => {
        let card = new Card(req.body);

        Card.add(card, db)
            .then(insertedCard => {
                res.status(200).send(insertedCard);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    };
};