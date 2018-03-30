<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
    uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>
<link href="${s}/css/codemirror.css" rel="stylesheet">
<link href="${s}/css/theme.css" rel="stylesheet">
<script src="${s}/js/codemirror.js"></script>
<script src="${s}/js/code-design.js"></script>
<script src="${s}/js/javascriptMode.js"></script>
<div class="jumbotron">
        <h1 class="display-4">Design your code</h1>
        <div class="row">
            <div class="input-group image-preview">
            <input type="text" id="codeFileName" class="form-control image-preview-filename" placeholder="Set the name for your code">
            <span class="input-group-btn">
            	<div class="btn btn-default image-preview-input">
                    <span class="glyphicon glyphicon-folder-open"></span>
                    <span class="image-preview-input-title">Browse</span>
                    <input type="file" class="file" name="inputFile" id="fileSent" data-error="No has especificado el fichero">
                </div>
            </span>
            </div>
        </div>
        <div class="row">
        	<textarea id="codeText" class="codemirror-textarea"></textarea> 
		</div>
        <div class="row">
                <div class="col-sm-4"></div>
                    <div class="col-sm-2">
                        <a href="/" type="button" onclick="javascript:alert('not implemented yet !!');" class="btn btn-primary max_width results">Upload</a>		  		
                    </div>
                    <div class="col-sm-2">
                        <a href="/settings" type="button" class="btn btn-primary max_width results">Cancel</a>		  		
                    </div>
                    <div class="col-sm-4"></div>
                </div>
        </div>
    </div>
<%@ include file="../jspf/footer.jspf"%>