'use strict';

function admin(){
	
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	canvas.width = parent.width();
	canvas.height = parent.height();

	let battleGround = new BattleGround(canvas, 10, 10);
	
	window.onresize = function() {
		
		canvas.width = parent.width();
		canvas.height = parent.height();
		
		battleGround.reset(canvas);
	    battleGround.clear().drawMapContent();
    
    };
	
	let codeMirror = document.getElementById("codeText");
	
	let codeMirrorEditor = CodeMirror.fromTextArea(codeMirror, {
		lineNumbers : true,
		mode : "javascript",
		theme : "lucario",
		indentUnit : 4,
		tabSize : 4,
		smartIndent : true,
		maxHighlightLength : Infinity,
		extraKeys: {"Ctrl-Space": "autocomplete"}
	});
	
	function getId(element){
		element = element.attr("value");
		if (element != undefined && element != null){
			return JSON.parse(element).id;
		}
		return null;
	}
	
    let listSelect = $('#myListSelect');
    let selectLinks = listSelect.find('a');
    
    let id = "codes";
    
	selectLinks.click(function(e) {
	    	
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        
        var listZone = $('#listZone');
        listZone.find('a').removeClass("active");
        let lists = listZone.find('.lista');
        id = $(this).attr("id");
        let cur = listZone.find('#'+ id);
        lists.hide();
        cur.show();
       
    });
	 
	 let listZone = $('#listZone');
	 let listItems = listZone.find('a');
	    
	 listItems.click(function(e) {
		 if($(this).hasClass('active')) {
			 $(this).removeClass("active");
		 }
		 else {
			 $(this).addClass("active"); 
		 }
		 if (id == "maps"){
			 loadData('/loadMap/' + $(this).attr("id"), function(data){
				battleGround.reset(canvas);
				data = JSON.parse(data);
				battleGround = new BattleGround(canvas, data.cellDim.rows, data.cellDim.cols);
				battleGround.fillContent(data, function(){
				    battleGround.clear().drawMapContent();
				});
			});
		 }
		 else if (id == "codes"){
			loadData('/loadCode/' + $(this).attr("id"), function(data){
		    	codeMirrorEditor.setValue(data);
			});
		 }
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