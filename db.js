const sqlite3 = require('sqlite3').verbose();
const path = './bookings.sqlite'

function createDbConnection() {

    const db = new sqlite3.Database(path, (err) => {
        if(err) return console.log(err.message);
        createTables(db);
    });
    console.log("Anslutningen till databasen är upprättad");
    return db;
}

function createTables(db) {
    db.exec(
        `CREATE TABLE IF NOT EXISTS booked (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            bookedAt varchar NOT NULL,
            bookingNumber varchar NOT NULL,
            email varchar NOT NULL,
            lanes integer NOT NULL,
            participants varchar NOT NULL,
            shoesizes varchar NOT NULL
        );`
    );
}

module.exports = createDbConnection();