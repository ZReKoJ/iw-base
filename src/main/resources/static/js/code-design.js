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
	
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
    	codeMirrorEditor.setValue(this.responseText);
    };
    xhr.open('GET', path);
    xhr.send();

	document.getElementById("upload").addEventListener("click", function(e){
		if (document.getElementById("codeFileName").value == ""){
			e.preventDefault();
			alert("Error: No file name");
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