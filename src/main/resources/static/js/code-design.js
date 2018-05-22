'use strict';

function codeDesign(codeId) {
	
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
	
	let path = "/static/js/example.js"
	if (codeId != null && codeId != undefined && codeId != ""){
		path = '/loadCode/' + codeId;
	}
	
	loadData(path, function(data){
    	codeMirrorEditor.setValue(data);
	});

	document.getElementById("upload").addEventListener("click", function(e){
		e.preventDefault();
		if (document.getElementById("codeFileName").value == ""){
			notifier.warning("Name is required");
		}
		else{
			let title = $("#codeFileName").val();
			if (!hasJavascript(title)) {
				$.post("/createCode", {
					"_csrf" : csrf_data.token, 
					"code" : codeMirrorEditor.getValue(),
					"codeFileName": title},
					function(data){notifier.success(data)});
			}
			else {
				notifier.error("The title has javascript!");
			}
		}
	});
	
	$("#fileButton").change(function() {
	    let fileInput = document.getElementById('fileSent');
	    let file = fileInput.files[0];
	    $("#codeFileName").val(file.name);
	        
        let fileReader = new FileReader();
		fileReader.readAsText(file);
        fileReader.onload = function (e) {
        	codeMirrorEditor.setValue(fileReader.result);
		}
	});
	
}