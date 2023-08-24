const db = require('./../db');
const uuid = require('uuid-random');

function getBookings(bookingID) {

    return new Promise((resolve, reject) => {

        db.get(
            `SELECT lanes, participants, shoesizes FROM booked WHERE bookingID = ?1`
            , {
                1: bookingID
            },
            function (err, row) {
    
                if(err) {
    
                    reject(err.message);
                }

                else {

                    resolve(row);
                }
            }
        )
    });
}

function newBooking(bookingData) {

    return new Promise((resolve, reject) => {

        const bookingID = uuid().toString();
        let { bookedAt, email, lanes, participants, shoeSizes } = bookingData;

        let bookedLanes = "";
        let usedShoeSizes = "";

        for(let i = 0; i < lanes.length; i++) {

            bookedLanes += lanes[i] + ", ";
        }

        for(let i = 0; i < shoeSizes.length; i++) {

            usedShoeSizes += shoeSizes[i] + ", ";
        }

        db.run(
            `INSERT INTO booked (bookingID, email, lanes, participants, shoeSizes)
            VALUES (?1, ?2, ?3, ?4, ?5)`
            , {
                1: bookingID,
                2: email,
                3: bookedLanes,
                4: participants,
                5: usedShoeSizes
            },
            function(err) {

                if(err) {

                    reject(err.message);
                }
            });

        for(let i = 0; i < lanes.length; i++) {

            db.run(
                `INSERT INTO lane_${lanes[i]} (bookedAt, bookingID)
                VALUES (?1, ?2)
                `, {
                    1: bookedAt,
                    2: bookingID
                },
                function(err) {

                    if(err) {

                        reject(err.message);
                    }
                }
            )
        }

        resolve(bookingID);
    });
}

function editBooking(bookingID, date, laneNum) {

    return new Promise((resolve, reject) => {

        db.run(
            `UPDATE lane_${laneNum} SET bookedAt = ?1 WHERE bookingID = ?2`
            , {
                1: date,
                2: bookingID
            }, 
            function (err) {

                if(err) {

                    reject(err.message);
                }

                else {
                    
                    resolve(this.changes);
                }
            }
        )
    });
}

function removeBooking(bookingID) {

    return new Promise((resolve, reject) => {

        db.run(
            `DELETE FROM booked WHERE bookingID = ?1`
            , {
                1: bookingID
            },
            function (err) {

                if(err) {

                    reject(err.message);
                }

                else {

                    resolve(this.changes);
                }
            }
        )
    });
}

function removeBookedLane(bookingID, laneNum) {

    return new Promise((resolve, reject) => {

        db.run(
            `DELETE FROM lane_${laneNum} WHERE bookingID = ?1`
            , {
                1: bookingID
            },
            function (err) {

                if(err) {

                    reject(err.message);
                }

                else {

                    resolve(this.changes);
                }
            }
        )
    });
}

function isLaneTaken(laneNum, date) {

    return new Promise((resolve, reject) => {

        db.get(
            `SELECT ID FROM lane_${laneNum} WHERE bookedAt = ?1`
            , {
                1: date
            },
            function (err, row) {

                if(err) {

                    reject(err.message);
                }

                if(row !== undefined) {

                    resolve(true);
                }

                else {

                    resolve(false);
                }
            }
        )
    });
}

module.exports = { getBookings, newBooking, editBooking, removeBooking, removeBookedLane, isLaneTaken }