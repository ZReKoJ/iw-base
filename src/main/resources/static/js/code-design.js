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
    
    $("#original").click(function() {
        $("#codeFileName").val($(this).text());
        editor.setValue("hola mundo");
    });
});