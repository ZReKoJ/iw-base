'use strict';

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