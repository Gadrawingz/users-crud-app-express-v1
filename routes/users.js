let express = require("express");
let router = express.Router();
let DBconn = require("../libs/database");
// Route for all users

router.get("/", (req, res) => {
  DBconn.query("SELECT * FROM users", (err, rows) => {
    if (err) {
      req.flash("error", err);
      res.render("users", {
        data: "",
      });
    } else {
      res.render("users", {
        data: rows,
      });
    }
  });
});

// Routes for adding user (render to add.ejs)
router.get("/add", (req, res) => {
  res.render("users/add", {
    name: "",
    email: "",
    position: "",
  });
});

router.post("/add", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let position = req.body.position;
  let errors = false;

  if (name.length === 0 || email.length === 0 || position === 0) {
    errors = true;
    req.flash("error", "Please enter name, email and pos.");
    res.render("users/add", {
      name: name,
      email: email,
      position: position,
    });
  }

  if (!errors) { // If there's no error
    let userData = {
      name: name,
      email: email,
      position: position,
    }

    // Insert into user table
    sql = "INSERT INTO users SET ?";
    DBconn.query(sql, userData, (err, result) => {
      if (err) {
        req.flash("error", err); //if error throw error
        // render to add.js
        res.render("users/add", {
          name: name,
          email: email,
          position: position,
        })
      } else {
        req.flash("success", "User Added!");
        res.redirect("/users");
      }
    });
  }
});

// Delete User from a table
router.get('/delete/(:id)', (req, res, next) => {
  let id = req.params.id;
  sql = `DELETE FROM users WHERE id=${id}`
  DBconn.query(sql, function(err, result) {
    if(err) {
      req.flash('error', err)
      res.redirect('/users')
    } else {
      req.flash('success', "User removed!")
      res.redirect('/users')
    }
  })
})


// Export a stuff
module.exports = router;
