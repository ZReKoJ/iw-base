'use strict';

function mapDesign(mapId) {
	
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	let grid = document.getElementById("grid-element");

	canvas.width = parent.width();
	canvas.height = parent.width();
	grid.style.height = canvas.height + "px";
	
	$('.btn-number').click(function(e){
	    let fieldName = $(this).attr('data-field');
	    let type      = $(this).attr('data-type');
	    let input = $("input[name='" + fieldName + "']");
	    let currentVal = parseInt(input.val());
	    
	    if (!isNaN(currentVal)) {
	    	switch (type) {
	    	case 'minus': 
	    		
	    		if(currentVal > input.attr('min')) {
	                input.val(currentVal - 1).change();
	            } 
	            
	            if(parseInt(input.val()) == input.attr('min')) {
	                $(this).attr('disabled', true);
	            }
	            
    		break;
	    	case 'plus': 
	    	
	    		if(currentVal < input.attr('max')) {
	                input.val(currentVal + 1).change();
	            }
	            
	            if(parseInt(input.val()) == input.attr('max')) {
	                $(this).attr('disabled', true);
	            }
    		
            break;
	    	default: break;
	    	}
	    } 
	    else {
	        input.val(0);
	    }
	    
	    e.preventDefault();
	});
	$('.input-number').focusin(function(){
	   $(this).data('oldValue', $(this).val());
	});
	$('.input-number').change(function() {
	    
	    minValue =  parseInt($(this).attr('min'));
	    maxValue =  parseInt($(this).attr('max'));
	    valueCurrent = parseInt($(this).val());
	    
	    name = $(this).attr('name');
	    if(valueCurrent >= minValue) {
	        $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
	    } else {
	        alert('Sorry, the minimum value was reached');
	        $(this).val($(this).data('oldValue'));
	    }
	    if(valueCurrent <= maxValue) {
	        $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
	    } else {
	        alert('Sorry, the maximum value was reached');
	        $(this).val($(this).data('oldValue'));
	    }
	    
	    
	});
	
	let battleGround = new BattleGround(canvas, parseInt($("input[name='rows']").val()), parseInt($("input[name='cols']").val()));
	if (mapId != null && mapId != undefined && mapId != ""){
		let data = undefined;
		loadData('/loadMap/' + mapId, function(data){
			data = JSON.parse(data);
			battleGround = new BattleGround(canvas, data.cellDim.rows, data.cellDim.cols);
			battleGround.fillContent(data, function(){
			    battleGround.clear().drawMapContent().drawCellMap().writeInfo();
			});
		});
	}
	
	document.getElementById("resize").addEventListener("click", function(){
		battleGround = new BattleGround(canvas, parseInt($("input[name='rows']").val()), parseInt($("input[name='cols']").val()));
		battleGround.reset(canvas);
	    battleGround.clear().drawMapContent().drawCellMap().writeInfo();
	});
	
	let index;
	let drag = false;
	
	canvas.addEventListener('mousemove', function(event) {
		let rect = canvas.getBoundingClientRect();
		let x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
        let y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
		battleGround.mouseAt = battleGround.defineMouseAt(x, y);

		if (drag) battleGround.setImageOnCell(battleGround.mouseAt.cellPosition.y, battleGround.mouseAt.cellPosition.x, $('.selection')[0], index);
		
	    battleGround.clear().drawMapContent().drawCellMap().writeInfo();
	    battleGround.drawCell(battleGround.mouseAt.cellPosition.x, battleGround.mouseAt.cellPosition.y);
	    
	    event.returnValue = false;
	});

	canvas.addEventListener('mousedown', function(event) {

		drag = true;
		
		battleGround.setImageOnCell(battleGround.mouseAt.cellPosition.y, battleGround.mouseAt.cellPosition.x, $('.selection')[0], index);
	    
		event.returnValue = false;
	    
	});

	canvas.addEventListener('mouseup',function(event){

	    drag = false;
	    
	    event.returnValue = false;
	    
	});

	canvas.addEventListener('wheel', function(event){
		
		if (event.deltaY < 0) battleGround.zoomIn();
		else battleGround.zoomOut();
		
        let oldTable = battleGround.table;
        battleGround.table = new Rectangle(battleGround.cols * battleGround.cell.width, battleGround.rows * battleGround.cell.height);
        battleGround.mapCenter.relativeLocation(oldTable, battleGround.table);
        battleGround.defineMapFeature();
        battleGround.clear().drawMapContent().drawCellMap().writeInfo();
	    battleGround.drawCell(battleGround.mouseAt.cellPosition.x, battleGround.mouseAt.cellPosition.y);
	    
	    event.returnValue = false;
	    
	});
	
	window.onresize = function() {
		canvas.width = parent.width();
		canvas.height = parent.width();
		grid.style.height = canvas.height + "px";
		battleGround.reset(canvas);
	    battleGround.clear().drawMapContent().drawCellMap().writeInfo();
    
    };

	let path;
	for (let x = 0; x <= 30; x++){
		path = "<img class='icon' src='/static/img/map/component (" + x + ").png'>";
		$('#grid-element').append(path)
	}
    
	let imgs = $('#grid-element').find('img');
	
	imgs.click(function(e) {
		$(this).addClass("selection"); 
		$(this).siblings('img.icon.selection').removeClass("selection");
		index = $(this).index();
	});
	
	imgs.mouseover(function(){
		$(this).attr("style", "border: 2px solid white");
		$(this).siblings('img.icon').removeAttr( "style" );
	});
	
	document.getElementById("upload").addEventListener("click", function(){
		if (document.getElementById("mapFileName").value != ""){
			console.log(battleGround.json());
			$.post("/createMap", {
				"_csrf" : csrf_data.token, 
				"json" : battleGround.json(),
				"mapFileName": document.getElementById("mapFileName").value},
				function(data){notifier.success(data)});
		}
		else {
			notifier.warning("Name is required");
		}
	});
	
    battleGround.drawCellMap().writeInfo();
}
