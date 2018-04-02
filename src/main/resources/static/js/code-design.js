$(document).ready(function(){
	var code = document.getElementById("codeText");
	var editor = CodeMirror.fromTextArea(code, {
		lineNumbers : true,
		mode : "javascript",
		theme : "lucario",
		indentUnit : 4,
		tabSize : 4,
		smartIndent : true,
		maxHighlightLength : Infinity,
		extraKeys: {"Ctrl-Space": "autocomplete"}
	});
	
    editor.setValue(document.documentElement.innerHTML);

    $(".btn-glyphicon-title").change(function() {
        var fileInput = document.getElementById('fileSent');
        var file = fileInput.files[0];
        $("#codeFileName").val(file.name);
        
        var fileReader = new FileReader();
		fileReader.readAsText(file);
        fileReader.onload = function (e) {
			editor.setValue(fileReader.result);
		}
    });
    
});