(function() {
    const Datastore = require('nedb');

    const DB = require('./src/db');
    const db = new Datastore({ filename: 'database.db', autoload: true });

    DB.forEach(entry => {
        db.insert(entry, err => err && console.log(err));
    });
})();
