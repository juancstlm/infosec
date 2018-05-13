var mysql = require("mysql");
var config = require("./config.json");
var pool = mysql.createPool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname
});

exports.handler = (event, context, callback) => {

  console.log('Event started')
  const username = event.username;
  const password = event.password; //must be hashed

    var query =
      'SELECT username FROM users where username = "' +
      username +
      '" and password = "' +
      password +
      '"';

  //prevent timeout from waiting event loop
  context.callbackWaitsForEmptyEventLoop = false;

  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query(query, function(error, results, fields) {
      // And done with the connection.
      connection.release();
      // Handle error after the release.
      
      if (error) { var error = new Error("something is wrong");
    callback(error)}
      else {
        if(results[0]){
          callback(null, results[0].username);
        }
        else{
           var error = new Error("something is wrong");
            callback(error);
        }
        }
    });
  });
};
