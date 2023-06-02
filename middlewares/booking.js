
async function checkBookingBody(req, res, next) {

    const { year, month, day, hour } = req.body.bookedAt;

    typeof (req.body.shoeSizes);
    req.body.bookedAt = new Date(year, month, day, hour).toDateString();
    
    if(req.body.bookedAt < Date().toString()) {
        res.send({
            success: false,
            message: "Datumet har redan varit"
        })
    }

    if('bookedAt' in req.body === false||
       'email' in req.body === false ||
       'lanes' in req.body === false ||
       'participants' in req.body === false ||
       'shoeSizes' in req.body === false)  {
            res.send({
                success: false,
                message: "All data finns inte"
            });
       }
       
    else if(typeof (req.body.bookedAt) !== "string" ||
            typeof (req.body.email) !== "string" ||
            typeof (req.body.lanes) !== "string" ||
            typeof (req.body.participants) !== "number" ||
            typeof (req.body.shoeSizes) !== "array") {
                res.send({
                    success: false,
                    message: "Fel datatyp på data"
                });
            }

    else if(req.body.lanes < 1 || req.body.lanes > 8 ||
            req.body.shoeSizes.length != req.body.participants) {

    }

    else {
        next();
    }
}

async function checkEditBody(req, res, next) {

    for(data in req.body) {
        if(data === undefined) {
            data = null;
        }
    }

    if('bookedAt' in req.body === false||
       'email' in req.body === false ||
       'lanes' in req.body === false ||
       'participants' in req.body === false ||
       'shoeSizes' in req.body === false)  {
            res.send({
                success: false,
                message: "All nödvändig data finns inte"
            });
       }

    else if((typeof (req.body.bookedAt) !== "string" || null) ||
            (typeof (req.body.email) !== "string" || null) ||
            (typeof (req.body.lanes) !== "string" || null) ||
            (typeof (req.body.participants) !== "string" || null) ||
            (typeof (req.body.shoeSizes) !== "string" || null)) {
                res.send({
                    success: false,
                    message: "Fel datatyp i keys"
                });
            }
    
    else {
        next();
    }
}

module.exports = { checkBookingBody, checkEditBody }