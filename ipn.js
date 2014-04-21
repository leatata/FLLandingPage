var express = require('express')
  , http    = require('http')
  , ipn     = require('paypal-ipn')
  , fs      = require('fs');

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser());

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

            }
	}
    });
});

http.createServer(app).listen(app.get('port'), function() {
    console.log("Paypal IPN server listening on port " + app.get('port'));
});

