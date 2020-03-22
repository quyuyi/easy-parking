var express = require('express');
var router = express.Router();

const Datastore = require('nedb');

const db = new Datastore({filename: 'database.db', autoload: true});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('index.html');
});

/* Database routes. */
router.get('/db', function(req, res, next) {
    db.find({}, function (err, docs) {
        res.json({data: docs});
    });
});

/* api for book slot */
router.post('/api/book', function(req, res, next) {
    console.log(req.body);

});

module.exports = router;
