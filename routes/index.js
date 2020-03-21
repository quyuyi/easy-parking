var express = require('express');
var router = express.Router();

let DB = require('../src/db');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('index.html');
});

/* Database routes. */
router.get('/db', function(req, res, next) {
    res.json({ data: DB });
});

module.exports = router;
