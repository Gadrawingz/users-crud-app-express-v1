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

// Post data
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

// Delete User from user table
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


// Update user
// Display edit user page
router.get('/edit/(:id)', (req, res, next)=> {
  let id = req.params.id;
  let sql4 = `SELECT * FROM users WHERE id= ${id}`;
  DBconn.query(sql4, (err, rows, fields) => {
    if(err) throw err
    // if user not found
    if(rows.length <=0) {
      req.flash('error', `User not found id ${id}`)
      res.redirect('/users')
    } else {
      res.render('users/edit', {
        title: 'Edit this user',
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        position: rows[0].position
      })
    }
  })
})

// Update user data
router.post('/update/:id', (req, res, next)=> {
  let id = req.params.id;
  let name = req.body.name;
  let email = req.body.email;
  let position = req.body.position;
  let errors = false;

  if(name.length === 0 || email.length === 0 || position.length === 0) {
    errors = true;
    req.flash('error', 'Please fill or fields')
    res.render('users/edit', {
      id: req.params.id,
      name: name,
      email: email,
      position: position
    })
  }

  if(!errors) {
    let userData = {
      name: name,
      email: email,
      position: position
    }

    sql1 = `UPDATE users SET ? WHERE id = ${id}`
    DBconn.query(sql1, userData, (err, result) => {
      if(err) {
        req.flash('error', err) // Set flash msg
        res.render('users/edit', { // Render to edit.js
          id: req.params.id,
          name: userData.name,
          email: userData.email,
          position: userData.position
        })
      } else {
        req.flash('success', 'User is updated!')
        res.redirect('/users')
      }
    })
  }
})


// Export a stuff
module.exports = router;
