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
router.post('/api/book', async function(req, res, next) {
    console.log(req.body);
    let doc = await new Promise(resolve => {
        db.find({ _id: req.body.id}, function(err, docs) {
            resolve(docs[0]);
        });
    });
    doc.layout.slots[req.body.i].state = "occupied";
    db.update({_id: req.body.id}, { $set: { layout: doc.layout, vacant: doc.vacant-1 } }, {}, function(err, numReplaced){
        console.log(numReplaced);
    });
    res.json({message: "success"});
});

module.exports = router;
