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

const maxNumOfLanes = 8;

function createTables(db) {

    db.exec(
        `CREATE TABLE IF NOT EXISTS booked (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            bookingID varchar NOT NULL,
            email varchar NOT NULL,
            lanes integer NOT NULL,
            participants varchar NOT NULL,
            shoesizes varchar NOT NULL
        );`
    );

    for(let i = 1; i <= maxNumOfLanes; i++) {

        db.exec(
            `CREATE TABLE IF NOT EXISTS lane_${i} (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                bookedAt varchar NOT NULL,
                bookingID varchar NOT NULL
            );`
        );
    }
}

module.exports = createDbConnection();