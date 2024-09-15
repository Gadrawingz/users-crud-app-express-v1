let express = require('express')
let router = express.Router();
let DBconn = require('../libs/database')


// Route for all users
router.get('/', (req, res, next) => {
    DBconn.query("SELECT * FROM users", (err, rows) => {
        if(err) {
            req.flash('error', err);
            res.render('users', {
                data: ''
            })
        } else {
            res.render('users', {
                data: rows
            })
        }
    })
})

// Export a stuff
module.exports = router;