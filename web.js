var async   = require('async')
  , express = require('express')
  , fs      = require('fs')
  , http    = require('http')
  , https   = require('https')
  , nodemailer = require("nodemailer")
  , db      = require('./models');

var app = express();
app.set('port', process.env.PORT || 8080);
app.use(express.bodyParser());

// Render homepage (note trailing slash): example.com/
app.get('/', function(request, response) {
  var data = fs.readFileSync('index.html').toString();
  response.send(data);
});

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER, //"bidbidhurra@gmail.com",
        pass: process.env.EMAIL_PWD //"alpaleje1"
    }
});

// Read email template from file
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
var emailTemplate = require("./emailTemplate.txt");

function sendWelcomeEmail (email) {
    // setup e-mail data with unicode symbols
    var mailOptions = {
	from: "Aprende Excel <bidbidhurra@bidbidhurra.com>", // sender address
	to: email, // list of receivers
	subject: "Curso Excel", // Subject line
	text: "Curso Excel", // plaintext body
	html: emailTemplate // html body
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
	if (error) {
            console.log(error);
	}
	else {
            console.log("Message sent: " + response.message);
	}

	// if you don't want to use this transport object anymore, uncomment following line
	//smtpTransport.close(); // shut down the connection pool, no more messages
    });    
}

// Manage email form submission
app.post('/', function(req, res) {
    var user = global.db.user;
    var email = req.body.email
    user
	.create({
	    email: email
	})
	.complete(function(err) {
	    if (!!err) {
		console.log('The instance has not been saved:', err)
	    }
	    else {
		sendWelcomeEmail(email);
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

