const express = require('express');
const app = express();
const port = 8000;

const { checkGetbookingsBody ,checkBookingBody, checkEditBody, checkDeleteBody } = require('./middlewares/booking');
const { getBookings, newBooking, editBooking, removeBooking, removeBookedLane, isLaneTaken } = require('./model/booking');

const { costPerPerson, costPerLane, maxNumOfLanes } = require('./utils');

app.use(express.json());

app.get('/api/booking', checkGetbookingsBody, async (req, res) => {
    
    const { bookingID } = req.body;

    const result = await getBookings(bookingID);

    if(result == undefined) {

        res.send({
            success: true,
            message: "Inga resultat hittades"
        })
    }

    else {

        res.send({
            success: true,
            result: {
                lanes: result.lanes,
                participants: result.participants,
                shoesizes: result.shoesizes
            }
        })
    }
});

app.post('/api/booking', checkBookingBody, async (req, res) => {

    const { year, month, day, hour } = req.body.bookedAt;

    req.body.bookedAt = new Date(year, month, day, hour);

    let message = "";

    for(let i = 0; i < req.body.lanes.length; i++) {

        const lane = parseInt(req.body.lanes[i]);

        const laneTaken = await isLaneTaken(lane, req.body.bookedAt);

        if(laneTaken) {

            message += lane + ", "
        }
    }

    if(message.length > 0) {

        res.send({
            success: false,
            message: `Banorna ${message} är upptagna.`
        })
    }

    else {

        const bookingID = await newBooking(req.body);

        const sum = req.body.lanes.length * costPerLane + req.body.participants * costPerPerson;

        res.send({
            success: true,
            message: "Bokning genomförd",
            ID: bookingID,
            cost: sum
        })
    }
});

app.put('/api/booking', checkEditBody, async (req, res) => {

    let { bookingID, bookedAt } = req.body;

    let message = "";

    const { year, month, day, hour } = bookedAt;
    bookedAt = new Date(year, month, day, hour);

    for(let i = 1; i <= maxNumOfLanes; i++) {
    
        const laneTaken = await isLaneTaken(i, bookedAt);

        if(laneTaken) {

            message += i + ", "
        }
    }

    if(message.length > 0) {

        res.send({
            success: false,
            message: `Banorna ${message} är upptagna.`
        })
    }

    else {

        let result = 0;

        for(let i = 1; i <= maxNumOfLanes; i++) {

            result = editBooking(bookingID, bookedAt, i);
        }

        if(result) {

            res.send({
                success: true,
                message: `Datumet för bokningarna med ID: ${bookingID} har redigerats`
            });
        }
        
        else {

            res.send({
                success: true,
                message: `Inga bokade tider kunde hittas`
            });
        }
    }
});

app.delete('/api/booking', checkDeleteBody, async (req, res) => {
    
    const { bookingID } = req.body;

    let success = await removeBooking(bookingID);

    for(let i = 1; i <= maxNumOfLanes; i++) {

        removeBookedLane(bookingID, i);
    }

    if(success) {

        res.send({
            success: true,
            message: `Bokningen med ID: ${bookingID} är borttagen`
        })
    }
    
    else {

        res.send({
            success: true,
            message: `Inga bokade tider kunde hittas`
        })
    }
});

app.listen(port, () => {

    console.log(`Server startad på port ${port}`);
});