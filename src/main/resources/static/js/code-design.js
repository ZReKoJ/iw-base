$(document).ready(function(){
	var code = document.getElementById("codeText");
	var editor = CodeMirror.fromTextArea(code, {
		lineNumbers : true,
		mode : "javascript",
		theme : "lucario",
		extraKeys: {"Ctrl-Space": "autocomplete"},
        value: document.documentElement.innerHTML
	});
});

$(".inputFile").change(function (){    
	var file = this.files[0];
    reader.onload = function (e) {
        $(".image-preview-filename").val(file.name);            
    }        
});  