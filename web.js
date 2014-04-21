var async   = require('async')
  , express = require('express')
  , fs      = require('fs')
  , http    = require('http')
  , https   = require('https')
  , nodemailer = require("nodemailer")
  , ipn     = require('paypal-ipn')
  , db      = require('./models');

var app = express();
app.set('port', process.env.PORT || 8080);
app.use(express.bodyParser());

// Render homepage (note trailing slash): example.com/
app.get('/', function(request, response) {
  var data = fs.readFileSync('index.html').toString();
  response.send(data);
});

app.get('/oferta', function(request, response) {
  var data = fs.readFileSync('ofertaUnicaVez.html').toString();
  response.send(data);
});

app.get('/iman', function(request, response) {
  var data = fs.readFileSync('imanProspectos.html').toString();
  response.send(data);
});

app.get('/ventas', function(request, response) {
  var data = fs.readFileSync('cartaVentas.html').toString();
  response.send(data);
});

app.get('/pagoOnline', function(request, response) {
  var data = fs.readFileSync('pagoOnline.html').toString();
  response.send(data);
});

app.get('/pagoOffline', function(request, response) {
  var data = fs.readFileSync('pagoOffline.html').toString();
  response.send(data);
});

app.get('/gracias', function(request, response) {
  var data = fs.readFileSync('gracias.html').toString();
  console.log("tx: " + request.query.tx);    
  response.send(data);
});

app.get('/losiento', function(request, response) {
  var data = fs.readFileSync('loSiento.html').toString();
  console.log("tx: " + request.query.tx);    
  response.send(data);
});

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    fromaddress: 'bidbidhurra@gmail.com',
    transport: 'SMTP',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PWD
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
app.post('/ajax', function(req, res) {
    var prospect = global.db.prospect;
    var email = req.body.email
    console.log("post: " + email);
    prospect
	.create({
	    email: email
	})
	.complete(function(err) {
	    if (!!err) {
		console.log('The prospect instance has not been saved:', err)
	    }
	    else {
		sendWelcomeEmail(email);
		res.send("OK");
	    }
	})
});

app.post('/paypal-ipn', function(req,res){
    console.log("IN PAYPAL !! req.body : "+JSON.stringify(req.body));

    ipn.verify(req.body, function callback(err, msg) {
	if (err) {
            console.log("Error:"+err);
	} else {
            //Do stuff with original params here
            console.log("req.body.payment_status :"+req.body.payment_status+" msg: "+msg);
            res.end();
            if (req.body.payment_status == 'Completed') {
		//Payment has been confirmed as completed
		var payment = global.db.payment;
		payment
		    .create({
			txn_id: req.body.txn_id,
			payment_status: req.body.payment_status,
			amount_gross: req.body.mc_gross,
			amount_tax: req.body.tax,
			payer_id: req.body.payer_id,
			email: req.body.payer_email,
			firstname: req.body.first_name,
			name: req.body.last_name,
			address_street: req.body.address_street,
			address_city: req.body.address_city,
			address_country: req.body.address_country_code,
			address_zip: req.body.address_zip 
		    })
		    .complete(function(err) {
			if (!!err) {
			    console.log('The payment instance has not been saved:', err)
			}
		    })
            }
	}
    });
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

