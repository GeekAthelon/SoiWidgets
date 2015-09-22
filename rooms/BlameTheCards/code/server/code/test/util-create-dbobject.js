function createDbObj() {
    var fs = require('fs');
    var file = 'test.db';
    var exists = fs.existsSync(file);

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(':memory:');

    db.on('trace', function(sql) {
        //console.info("sql: " + sql);
    });

    db.run(`DROP TABLE if exists deck`);

    return db;
}

exports = module.exports = createDbObj;
