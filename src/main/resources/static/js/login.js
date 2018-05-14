function login(){
	
	$('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	
	$("#register-form").submit(function (e) {
	    e.preventDefault();
	    $.post("/createUser", { 
	    		nickname: $("#regname").val(),
	    		password: $("#regpass").val(),
	    		_csrf: $("#regextra").val()},
	    		function (data) {
	    			submitLogin();
	    		});
	});
	
	function submitLogin(){
		$("#logname").val($("#regname").val());
		$("#logpass").val($("#regpass").val());
		$("#login-form").submit();
	}
}