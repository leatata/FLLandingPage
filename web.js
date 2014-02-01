var async   = require('async')
  , express = require('express')
  , fs      = require('fs')
  , http    = require('http')
  , https   = require('https')
  , db      = require('./models');

var app = express();
app.set('port', process.env.PORT || 8080);
app.use(express.bodyParser());

// Render homepage (note trailing slash): example.com/
app.get('/', function(request, response) {
  var data = fs.readFileSync('index.html').toString();
  response.send(data);
});

// Manage email form submission
app.post('/', function(req, res) {
    var user = global.db.user;
    user
	.create({
	    email: req.body.email
	})
	.complete(function(err) {
	    if (!!err) {
		console.log('The instance has not been saved:', err)
	    }
	})
    res.redirect('/');
});

app.configure(function () {
    app.use(
        "/assets", //the URL throught which you want to access to you static content
        express.static(__dirname + '/assets') //where your static content is located in your filesystem
    );
});



// sync the database and start the server
db.sequelize.sync().complete(function(err) {
  if (err) {
    throw err;
  } else {
    app.listen(app.get('port'), function() {
      console.log("Listening on " + app.get('port'));
    });
  }
});

