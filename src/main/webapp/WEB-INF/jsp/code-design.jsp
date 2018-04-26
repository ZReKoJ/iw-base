<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<!-- Tema del editor de codemirror -->
<link href="${s}/css/theme.css" rel="stylesheet">
<!-- Codemirror editor -->
<link href="${s}/css/codemirror.css" rel="stylesheet">

<div class="jumbotron">
    <div class="page-title">Design your code</div>
    <hr class="my-4">
    <form id="code-form" action="/createCode" 
		enctype="multipart/form-data" method="post" role="form">
	    <div class="row">
	        <div class="input-group">
	        	
		            <input type="text" id="codeFileName" name="codeFileName" class="form-control" placeholder="Set the name for your code">
		            <span class="input-group-btn">
		                <div class="btn btn-default btn-glyphicon-title">
		                    <span class="glyphicon glyphicon-folder-open"></span>
		                    <span class="button-text">Browse</span>
		                    <input type="file" id="fileSent" class="file" data-error="No has especificado el fichero">
		                </div>
		            </span>
		           
	        </div>
	    </div>
	    <div class="row">
	        <textarea id="codeText" name="code" class="codemirror-textarea"></textarea> 
	    </div>
	    <div class="btn-toolbar pull-right">
	    	<button class="btn btn-primary" role="button" type="submit">Upload</button>
	        <a class="btn btn-primary" href="/" role="button">Cancel</a>
	    </div>
	    <input name="${_csrf.parameterName}" type="hidden" value="${_csrf.token}" />
	</form>	    
</div>

<script>
$( document ).ready(function() {
	codeDesign();
});
</script>

<script src="${s}/js/codemirror.js"></script>
<script src="${s}/js/javascriptMode.js"></script>
<%@ include file="../jspf/footer.jspf"%>