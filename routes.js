const users = require('./controllers/users');
const cards = require('./controllers/cards');
const jwtService = require('./services/jwtService');
const multer = require('multer');
const uploadAvatar = multer({ dest: 'uploads/avatars/' });
const fs = require('fs');
const path = require('path');

module.exports = function (app, db) {

    // token
    app.use(jwtService.check);

    // user routes`
    app.post('/api/user', users.postUser(app, db));
    app.get('/api/user', users.login(app, db));
    app.get('/api/user-by-token', users.getUserByToken(app, db));
    app.put('/api/user-profile', users.updateUserProfile(app, db));
    app.put('/api/user-avatar', uploadAvatar.single('avatar'), users.changeAvatar(app, db));
    app.get('/api/avatar', users.getAvatar(app, db));

    // cards routes
    app.post('/api/card', cards.createCard(app, db));
    app.patch('/api/toggle', cards.toggle(app, db));
    app.patch('/api/to-archive', cards.toArchive(app, db));
    app.patch('/api/to-trash', cards.toTrash(app, db));
    app.put('/api/to-home', cards.toHome(app, db));
    app.delete('/api/delete-forever', cards.deleteForever(app, db));
    app.post('/api/make-copy', cards.makeCopy(app, db));
    app.patch('/api/change-bg-color', cards.changeBgColor(app, db));
    app.put('/api/card', cards.updateCard(app, db));

    // fallback
    app.get('*', (req, res) => {
        const root = path.resolve('public', 'index.html');
        fs.readFile(root, (err, html) => {
            if (err) throw err;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
    });
};