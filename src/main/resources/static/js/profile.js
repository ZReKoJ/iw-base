function profile() {
	
    let buttons = $('#responsive');
    let links = buttons.find('a');
 
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
}