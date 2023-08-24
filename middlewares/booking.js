const { maxNumOfLanes, minNumOfLanes } = require('./../utils');


function checkGetbookingsBody(req, res, next) {

    if("bookingID" in req.body === false) {

        res.send({
            success: false,
            message: "Ett bokningsID behövs för att söka"
        })
    }
    
    else if(typeof req.body.bookingID !== "string") {

        res.send({
            success: false,
            message: "bokningsID måste vara en sträng"
        })
    }

    else {

        next();
    }
}

function checkBookingBody(req, res, next) {

    if('bookedAt' in req.body === false ||
       'email' in req.body === false ||
       'lanes' in req.body === false ||
       'participants' in req.body === false ||
       'shoeSizes' in req.body === false)  {
            res.send({
                success: false,
                message: "All data finns inte"
            });
    }
       
    else if(typeof (req.body.bookedAt) !== "object" ||
            typeof (req.body.email) !== "string" ||
            typeof (req.body.lanes) !== "object" ||
            typeof (req.body.participants) !== "number" ||
            typeof (req.body.shoeSizes) !== "object") {
                res.send({
                    success: false,
                    message: "Fel datatyp på data"
                });
    }

    else if("year" in req.body.bookedAt === false ||
            "month" in req.body.bookedAt === false ||
            "day" in req.body.bookedAt === false ||
            "hour" in req.body.bookedAt === false) {

                res.send({
                    success: false,
                    message: "Ett datum som består av år, månad, dag och timme krävs"
                })
    }

    else if(req.body.lanes < minNumOfLanes || req.body.lanes > maxNumOfLanes) {
                res.send({
                    success: false,
                    message: `Minst en bana behöver bokas, och högst ${maxNumOfLanes} kan bokas`
                })
    }

    else if(req.body.shoeSizes.length != req.body.participants) {
            res.send({
                success: false,
                message: "Alla deltagare behöver välja en skostorlek"
            })
    }

    else {
        next();
    }
}

function checkEditBody(req, res, next) {

    if('bookedAt' in req.body === false ||
       'bookingID' in req.body === false) {

        res.send({
            success: false,
            message: "BokningsID eller datum saknas"
        });
    }

    else if(typeof req.body.bookingID !== "string" ||
            typeof req.body.bookedAt !== "object") {

        res.send({
            success: false,
            message: "BokningsID måste vara en sträng, datumet måste vara ett objekt"
        });
    }

    else {

        next();
    }
}

function checkDeleteBody(req, res, next) {

    if("bookingID" in req.body === false) {

        res.send({
            success: false,
            message: "Ett ID nummer till bokningarna krävs"
        })
    }

    else if(typeof req.body.bookingID !== "string") {

        res.send({
            success: false,
            message: "ID måste vara en sträng"
        })
    }

    else {

        next();
    }
}

module.exports = { checkGetbookingsBody, checkBookingBody, checkEditBody, checkDeleteBody }