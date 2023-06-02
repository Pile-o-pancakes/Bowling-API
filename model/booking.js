const db = require('./../db');
const uuid = require('uuid-random');

// async function getBookedLanes() {

//     let result = [];
//     db.each(
//         `SELECT laneID, bookedAt FROM lanes;
//         `,
//         (err, row) => {
//             if(err) {
//                 console.log(err.message);
//                 return false;
//             }
//             else {
//                 result.push(row);
//             }
//         },
//         (err) => {
//             if(err) {
//                 console.log(err.message)
//                 return false;
//             }
//             else {
//                 return result;
//             }
//         });
// }

function newBooking(bookingData) {

    const bookingNumber = uuid().toString();
    const { bookedAt, email, lanes, participants, shoeSizes } = bookingData;
    db.run(
        `INSERT INTO booked (bookedAt, bookingNumber, email, lanes, participants, shoeSizes)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        `, {
            1: bookedAt,
            2: bookingNumber,
            3: email,
            4: lanes,
            5: participants,
            6: shoeSizes
        }
        ,
        (err) => {
            if(err) {
                console.log(err.message);
            }
        });
}

async function editBooking(bookingData) {

    const { bookedAt, bookingNumber, email, lanes, participants, shoeSizes } = bookingData;
    db.run(
        `UPDATE booked SET bookedAt = ?1, email = ?3, lanes = ?4, participants = ?5, shoeSizes = ?6
        WHERE bookingNumber = ${bookingNumber}
        `, {
            1: bookedAt,
            3: email,
            4: lanes,
            5: participants,
            6: shoeSizes
        },
        (err) => {
            if(err) {
                console.log(err.message);
                return false;
            }
            else {
                return true;
            }
        });
}

async function removeBooking(bookingNumber) {

    db.run(
        `DELETE FROM booked WHERE bookingNumber = ?1`,
        {
            1: bookingNumber
        },
        (err) => {
            if(err) {
                console.log(err.message);
                return false;
            }
        }
    )
}

module.exports = { getBookedLanes, newBooking, editBooking, removeBooking }