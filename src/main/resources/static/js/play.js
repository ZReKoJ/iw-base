'use strict';

function play() {
	
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	canvas.width = parent.width();
	canvas.height = parent.height();
	
	let battleGround = null;
	
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
		
	$("#owned-codes").change(function() {
		$("#all-codes option:disabled").prop("disabled", false);
		let selectedCodeId = $("#owned-codes option:selected").attr("id")
		$("#all-" + selectedCodeId).prop("disabled", true);
		$("#all-" + selectedCodeId).prop("selected", false);
		$("#all-codes").selectpicker("refresh");
		
		if($("#owned-codes option:selected").length == 1 && $("#all-maps option:selected").length == 1 && $("#all-codes option:selected").length >= 1){
			$("#play-submit").prop("disabled", false);
		}
		else{
			$("#play-submit").prop("disabled", true);
		}
		let id = getId($("#owned-codes option:selected"));
		if (id != null){
			loadData('/loadCode/' + id, function(data){
		    	codeMirrorEditor.setValue(data);
			});
		}
	});
	
	$("#all-maps").change(function() {
		if($("#owned-codes option:selected").length == 1 && $("#all-maps option:selected").length == 1 && $("#all-codes option:selected").length >= 1){
			$("#play-submit").prop("disabled", false);
		}
		else{
			$("#play-submit").prop("disabled", true);
		}
		let id = getId($("#all-maps option:selected"));
		if (id != null){
			loadData('/loadMap/' + id, function(data){
				if (battleGround != null)
					battleGround.reset(canvas);
				data = JSON.parse(data);
				battleGround = new BattleGround(canvas, data.cellDim.rows, data.cellDim.cols);
				battleGround.fillContent(data, function(){
				    battleGround.clear().drawMapContent();
				});
			});
		}
	});
	
	$("#all-codes").change(function() {
		if($("#owned-codes option:selected").length == 1 && $("#all-maps option:selected").length == 1 && $("#all-codes option:selected").length >= 1){
			$("#play-submit").prop("disabled", false);
		}
		else{
			$("#play-submit").prop("disabled", true);
		}
		let id = getId($("#all-codes option:selected:last"));
		if (id != null){
			loadData('/loadCode/' + id, function(data){
		    	codeMirrorEditor.setValue(data);
			});
		}
	});
	
}