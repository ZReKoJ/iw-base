<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<div class="jumbotron">
    <h1 class="display-4">Design your map</h1>
    <hr class="my-4">
   
		    <div class="row">
		        <div id="grid-element">
		        </div>
		        <div class="map-content">
		            <canvas id="canvas" name="canvas"></canvas>
		            <input name="${_csrf.parameterName}" type="hidden" value="${_csrf.token}" />
		        </div>
		    </div>
		    <div class="row">
		        <div class="btn-toolbar pull-right">
		            <button class="btn btn-primary" role="button" onClick="mapUpload()">Upload</button>
		            <a class="btn btn-primary" href="/settings" role="button">Cancel</a>
		            <a id="test" class="btn btn-primary" href="#" onclick="javascript:alert('this is a test');" role="button">Test</a>
		        </div>
		    </div>
	
</div>

<script>
	$( document ).ready(function() {
		mapDesign();
	});
</script>

<%@ include file="../jspf/footer.jspf"%>