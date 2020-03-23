var express = require('express');
var router = express.Router();
const Datastore = require('nedb');

const db = new Datastore({ filename: 'database.db', autoload: true });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('index.html');
});

/* Database routes. */
router.get('/db', function(req, res, next) {
    db.find({}, function (err, docs) {
        if (err) console.log(err);
        res.json({ data: docs });
    });
});

/* Api for booking slots. */
router.post('/api/book', async function(req, res, next) {
    console.log(req.body);
    let doc = await new Promise((resolve, reject) => {
        db.find({ _id: req.body.id}, function(err, docs) {
            if (err) reject(err);
            resolve(docs[0]);
        });
    }).catch(err => console.log(err));
    const message = await new Promise((resolve, reject) => {
        if (doc.layout.slots[req.body.i].state === 'occupied')
            resolve({
                message: 'Oops, you are too late! This slot has already been booked by others.',
                status: false
            });
        doc.layout.slots[req.body.i].state = "occupied";
        db.update({ _id: req.body.id }, { $set: { layout: doc.layout, vacant: doc.vacant - 1 } }, {}, function(err, numReplaced){
            if (err) reject(err);
            resolve({
                message: 'You are all set!',
                status: true
            });
        });
    }).catch(err => console.log(err));
    res.json(message);
});

module.exports = router;
