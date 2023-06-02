const express = require('express');
const app = express();
const port = 8000;

const { checkBookingBody, checkEditBody } = require('./middlewares/booking');
const { newBooking, editBooking, removeBooking } = require('./model/booking');

app.use(express.json());

// app.get('/api/booking', async (req, res) => {
    
//     const result = await getBookedLanes();
//     if(result != false) {
//         res.send({
//             success: true,
//             message: (result === undefined ? "Inga banor är bokade" : result)
//         });
//     }
//     else {
//         res.send({
//             success: false,
//             message: "Kunde inte hämta data"
//         });
//     }
// });

app.post('/api/booking', checkBookingBody, (req, res) => {

    const result = newBooking(req.body);

    if(result) {
        res.send({
            success: true
        })
    }
    else {
        res.send({
            success: false,
            message: "Kunde inte spara data"
        })
    }
});

app.put('/api/booking', checkEditBody, (req, res) => {

    const result = editBooking(req.body);

    if(result) {
        res.send({
            success: true,
            message: "Bokningen har redigerats"
        })
    }
    else {
        res.send({
            success: false,
            message: "Kunde inte redigera data"
        })
    }
});

app.delete('/api/booking', (req, res) => {
    
    const { bookingNumber } = req.body;
    const result = removeBooking(bookingNumber);

    if(result) {
        res.send({
            success: true,
            message: "Bokning borttagen"
        })
    }
    else {
        res.send({
            success: false,
            message: "Kunde inte ta bort bokningen"
        })
    }
});

app.listen(port, () => {
    console.log(`Server startad på port ${port}`);
});

/*
    Data som ska med vid bokning:
        Datum då man vill boka in sig
        e-post adress
        tidsintervall bokningen gäller (en bokning varar 60 min)
        antal personer
        antal banor man vill boka
        skostorlek för alla personer
        totalpris, 120 kr/person, 100 kr/bana
        ett genererat bokningsnummer

        routes:
            get:
                se bokningar man gjort
            post:
                ny bokning
            put:
                ändra bokning
            delete:
                ta bort bokning
*/