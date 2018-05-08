document.addEventListener('DOMContentLoaded', function () {
	$("#owned-codes").change(function() {
		$("#all-codes option:disabled").prop("disabled", false);
		var selectedCodeId = $("#owned-codes option:selected").attr("value");
		$("#all-" + selectedCodeId).prop("disabled", true);
		$("#all-" + selectedCodeId).prop("selected", false);
		$("#all-codes").selectpicker("refresh");
	});
});