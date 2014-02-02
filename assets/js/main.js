/*
bootstrap_alert = function() {}
bootstrap_alert.warning = function(message) {
    $('#alert_placeholder').html('<div class="alert"><a class="close" data-dismiss="alert">x</a><span>'+message+'</span></div>')
}
*/

$( "Form" ).submit(function( event ) {
//    alert("Gracias!! En breve te enviaremos el correo");
    event.preventDefault();
    console.log("Submit form");
});

function submitForm (event) {  
    event.preventDefault();
    var email = $(this).prevAll('div').children().val();
    $(this).prevAll('div').children().val("");
    $.ajax({ 
        url: "/ajax",
        type: "POST",
        cache: false, 
        data: JSON.stringify({email: email}), 
	contentType: "application/json",
	timeout: 5000,
	success: function(data) {
	    console.log('process sucess');
	},
	error: function() {
	    console.log('process error');
	},
    })
};

$('#enter1').click(submitForm);    
$('#enter2').click(submitForm);    
$('#enter3').click(submitForm);    
$('#enter4').click(submitForm);    
