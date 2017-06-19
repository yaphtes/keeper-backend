const MongoClient = require('mongodb').MongoClient;
const credentials = require('./credentials');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const express = require('express');
const path = require('path');
const app = express();


app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'assets')));


MongoClient.connect(credentials.mongo, (err, database) => {
    if (err) console.error(err);
    require('./routes')(app, database);
    app.listen(app.get('port'), () => console.log('server started'));
});
