// DB Connection
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'g1234',
    database: 'node_crud1',
});

connection.connect(function(error) {
    if(error) { // or if(!!error)
        console.log(`Error: ${error}`)
    } else {
        console.log(`Database is connected!`)
    }
})

module.exports = connection;