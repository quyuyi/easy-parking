var express = require('express');
var router = express.Router();
const Datastore = require('nedb');

const db = new Datastore({ filename: 'database.db', autoload: true });
const booking = new Datastore({ filename: 'booking.db', autoload: true });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('index.html');
});

/* Database routes. */
router.get('/db', async function(req, res, next) {
    try {
        let [docs, booked] = await Promise.all([
            new Promise((resolve, reject) => {
                db.find({}, function(err, docs) {
                    if (err) reject(err);
                    resolve(docs);
                });
            }),
            new Promise((resolve, reject) => {
                booking.findOne({ ip: req.ip }, function(err, doc) {
                    if (err) reject(err);
                    resolve(doc);
                });
            })
        ]);
        if (booked) {
            docs.forEach((pl, i) => {
                if (pl._id === booked.parkingLotId)
                    docs[i].layout.slots[booked.slotIndex].state = 'car';
            });
        }
        res.send({ data: docs });
    }
    catch (e) {
        console.log(e);
        res.send({ data: [] });
    }
});

/* Endpoint for booking slots. */
router.post('/api/book', async function(req, res, next) {
    console.log(req.body);
    try {
        const booked = await new Promise((resolve, reject) => {
            booking.find({ ip: req.ip }, function(err, docs) {
                if (err) reject(err);
                resolve(docs);
            });
        });
        if (booked.length > 0) {
            res.send({
                message: 'Our system shows that you have already booked a slot. To book a different one, please checkout the previously booked one first.',
                status: 'rejected'
            });
            return;
        }
        let doc = await new Promise((resolve, reject) => {
            db.find({ _id: req.body.id }, function(err, docs) {
                if (err) reject(err);
                if (docs.length === 0) reject(new Error('No matched parking lot found.'));
                resolve(docs[0]);
            });
        });
        const message = await new Promise((resolve, reject) => {
            if (doc.layout.slots[req.body.i].state === 'occupied')
                resolve({
                    message: 'Oops, you are too late! This slot has already been booked by others.',
                    status: 'race'
                });
            doc.layout.slots[req.body.i].state = 'occupied';
            db.update({ _id: req.body.id }, { $set: { layout: doc.layout, vacant: doc.vacant - 1 } }, {}, function(err, numReplaced) {
                if (err) reject(err);
                if (numReplaced === 0) reject(new Error('No entry in the database was updated.'));
                resolve({
                    message: 'You are all set!',
                    status: 'success'
                });
            });
        });
        await new Promise((resolve, reject) => {
            booking.insert({ ip: req.ip, parkingLotId: req.body.id, slotIndex: req.body.i }, function(err, newDoc) {
                if (err) reject(err);
                resolve(newDoc);
            });
        });
        res.json(message);
    }
    catch (e) {
        console.log(e);
        res.json({
            message: 'Something went wrong. Please try again later.',
            status: 'rejected'
        });
    }
});

/* Endpoint for checking out booked slots. */
router.post('/api/checkout', async function(req, res, next) {
    console.log(req.body);
    try {
        let doc = await new Promise((resolve, reject) => {
            db.find({ _id: req.body.id }, function(err, docs) {
                if (err) reject(err);
                if (docs.length === 0) reject(new Error('No matched parking lot found.'));
                resolve(docs[0]);
            });
        });
        const message = await new Promise((resolve, reject) => {
            doc.layout.slots[req.body.i].state = doc.layout.slots[req.body.i].property;
            db.update({ _id: req.body.id }, { $set: { layout: doc.layout, vacant: doc.vacant + 1 } }, {}, function(err, numReplaced) {
                if (err) reject(err);
                if (numReplaced === 0) reject(new Error('Something went wrong for checkout.'));
                resolve({
                    message: 'You have checked out.',
                    status: 'success'
                });
            });
        });
        await new Promise((resolve, reject) => {
            booking.remove({ ip: req.ip }, {}, function(err, numRemoved) {
                if (err) reject(err);
                if (numRemoved === 0) reject(new Error('Something went wrong for checkout.'));
                resolve();
            });
        });
        res.send(message);
    }
    catch (e) {
        console.log(err);
        res.send({
            message: 'Something went wrong. Please try again later.',
            status: 'rejected'
        });
    }
});

module.exports = router;
