'use strict';

function play() {
	document.addEventListener('DOMContentLoaded', function () {
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
		});
		
		$("#all-maps").change(function() {
			if($("#owned-codes option:selected").length == 1 && $("#all-maps option:selected").length == 1 && $("#all-codes option:selected").length >= 1){
				$("#play-submit").prop("disabled", false);
			}
			else{
				$("#play-submit").prop("disabled", true);
			}
		});
		
		$("#all-codes").change(function() {
			if($("#owned-codes option:selected").length == 1 && $("#all-maps option:selected").length == 1 && $("#all-codes option:selected").length >= 1){
				$("#play-submit").prop("disabled", false);
			}
			else{
				$("#play-submit").prop("disabled", true);
			}
		});
	});
	
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	canvas.width = parent.width();
	canvas.height = parent.height();
	
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
}