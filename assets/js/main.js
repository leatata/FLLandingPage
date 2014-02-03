/*
bootstrap_alert = function() {}
bootstrap_alert.warning = function(message) {
    $('#alert_placeholder').html('<div class="alert"><a class="close" data-dismiss="alert">x</a><span>'+message+'</span></div>')
}
*/

$(document).ready(function() {
  jQuery.validator.setDefaults({
    errorPlacement: function(error, element) {
      // if the input has a prepend or append element, put the validation msg after the parent div
      if(element.parent().hasClass('input-prepend') || element.parent().hasClass('input-append')) {
          error.insertAfter(element.parent());
      // else just place the validation message immediatly after the input
      } else {
        error.insertAfter(element);
      }
    },
    //errorElement: "small", // contain the error msg in a small tag
    //wrapper: "div", // wrap the error message and small tag in a div
    highlight: function(element) {
      $(element).closest('.control-group').addClass('error'); // add the Bootstrap error class to the control group
    },
    success: function(element) {
      $(element).closest('.control-group').removeClass('error'); // remove the Boostrap error class from the control group
    }
  });
});

$(document).ready(function(){
    $('#form1').validate({
	rules: {
	    email: {
		required: true,
		email: true
	    }
	}
    });
});

$(document).ready(function(){
    $('#form2').validate({
	rules: {
	    email: {
		required: true,
		email: true
	    }
	}
    });
});

$(document).ready(function(){
    $('#form3').validate({
	rules: {
	    email: {
		required: true,
		email: true
	    }
	}
    });
});

$(document).ready(function(){
    $('#form4').validate({
	rules: {
	    email: {
		required: true,
		email: true
	    }
	}
    });
});

$("Form").submit(function( event ) {
    event.preventDefault();
});

function submitForm (event) {  
    event.preventDefault();
    if ($(this).parent().parent().valid()) {
	var email = $(this).prevAll('input').val();
	$(this).prevAll('input').val("");
	$.ajax({ 
            url: "/ajax",
            type: "POST",
            cache: false, 
            data: JSON.stringify({email: email}), 
	    contentType: "application/json",
	    timeout: 5000,
	    success: function(data) {
		$('#modalSuccess').modal('toggle')
		console.log('process sucess');
	    },
	    error: function() {
		$('#modalError').modal('toggle')
		console.log('process error');
	    },
	})
    }
};

$('#enter1').click(submitForm);    
$('#enter2').click(submitForm);    
$('#enter3').click(submitForm);    
$('#enter4').click(submitForm);    


