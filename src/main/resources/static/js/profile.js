'use strict';

function profile(socket, deletedName) {
	
    let buttons = $('#responsive');
    let links = buttons.find('a');
    
    
    if(deletedName != "")
    	notifier.warning("" + deletedName + " deleted");
 
    links.click(function(e) {
    	
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        
        let index = $(this).index();
        
        $("div.user-menu>div.user-menu-content").removeClass("active");
        $("div.user-menu>div.user-menu-content").eq(index).addClass("active");
        
    });

    $("[rel='tooltip']").tooltip();    
 
    $('.view').hover(
    		
        function(){
            $(this).find('.caption').slideDown(250); //.fadeIn(250)
        },
        
        function(){
            $(this).find('.caption').slideUp(250); //.fadeOut(205)
        }
        
        
    ); 
    
	$("#escrito").submit(function (e) {
		let message = $("#send").val();
		if (message != null && message != ""){
			socket.send(message);
			$("#send").val("");
		}
		e.preventDefault(); // avoid actual submit
	});
	
	$("#sendButton").click(function (e) {
		let message = $("#send").val();
		if (message != null && message != ""){
			socket.send(message);
			$("#send").val("");
		}
		e.preventDefault(); // avoid actual submit
	});
	
	socket.onmessage = function(e) {
		let log = $("#chat");
		log.val(log.val() + '\n' + e.data);
	}
}

