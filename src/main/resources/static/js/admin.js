'use strict';

function admin(){
	
    let listSelect = $('#myListSelect');
    let selectLinks = listSelect.find('a');
    
    
	 selectLinks.click(function(e) {
	    	
	        $(this).siblings('a.active').removeClass("active");
	        $(this).addClass("active");
	        
	        var listZone = $('#listZone');
	        listZone.find('a').removeClass("active");
	        let lists = listZone.find('.lista');
	        let cur = listZone.find('#'+$(this).attr("id"));
	        lists.hide();
	        cur.show();
	        
	       
	    });
	 
	 let listZone = $('#listZone');
	 let listItems = listZone.find('a');
	    
	    
	 listItems.click(function(e) {
		    	if($(this).hasClass('active'))
		    		$(this).removeClass("active");   
		    	else
		    		$(this).addClass("active"); 
		    });
}

function deleteSelectedItems(){
	
	let listZone = $('#listZone');
	let selectedItems = listZone.find('a.active');
	
	let selectList = $('#myListSelect');
	let active = selectList.find('a.active');

	if(active.first().attr('id') == "codes"){
		
		var codes = [];
		selectedItems.each(function () {
		   codes.push(this.id);
		});
		$.post("admin/deleteCodes",{"codes":codes, "_csrf": csrf_data.token}, function(data){
			window.location = data;
		}); 

	}else if(active.first().attr('id') == "maps"){

		var maps = [];
		selectedItems.each(function () {
		   maps.push(this.id);
		});
		$.post("admin/deleteMaps",{"maps":maps, "_csrf": csrf_data.token }, function(data){
			window.location = data;
		});
	

	}
	
    
}