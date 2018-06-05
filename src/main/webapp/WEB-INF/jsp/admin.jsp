<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<!-- Tema del editor de codemirror -->
<link href="${s}/css/code-design-theme.css" rel="stylesheet">
<!-- Codemirror editor -->
<link href="${s}/css/codemirror.css" rel="stylesheet">

<div class="row margin-top-80">
	<div class="preview pull-left">
		<canvas id="canvas"></canvas>
	</div>
	<div class="preview pull-right">
       	<textarea id="codeText" name="code" class="codemirror-textarea"></textarea> 
    </div>
</div>
<div class="row" style="height: 10px"></div>
<div class="row">
	<div class="col-sm-1"></div>
	<div class="col-sm-3">
		<div class="list-group" id="myListSelect" role="tablist">
		  <a class="list-group-item list-group-item-action active" role="tab" id="codes">Codes</a>
		  <a class="list-group-item list-group-item-action" role="tab" id="maps">Maps</a>	  
		</div>
	</div>
	<div class="col-sm-7" id="listZone">
		<div class="divList">
			
	 		<div class="list-group lista"  role="tablist"  id="codes">
				<c:forEach var="code" items="${codes}">
						<a class="list-group-item list-group-item-action" id="${code.id}">${code.creator.nickname}: ${code.name}</a>
				</c:forEach>
			</div>
			<div class="list-group lista"  role="tablist"  id="maps" hidden="true">
				<c:forEach var="map" items="${maps}">
						<a class="list-group-item list-group-item-action" id="${map.id}">${map.creator.nickname}: ${map.name}</a>
				</c:forEach>
			</div>
		</div>
		    
		
		<div class="form-actions">
		    <button class="btn btn-primary" onclick="deleteSelectedItems()">Delete selected items</button>
		    <a type="button" href="/" class="btn btn-primary">Back</a>
		    
		</div>		
		
	</div>
	<div class="col-sm-1"></div>
	
</div>
<script>
    $( document ).ready(function() {
    	admin();
    });
</script>

<script src="${s}/js/map-properties.js"></script>
<script src="${s}/js/battle-ground.js"></script>
<script src="${s}/js/codemirror.js"></script>
<script src="${s}/js/javascriptMode.js"></script>
<script src="${s}/js/admin.js"></script>
<%@ include file="../jspf/footer.jspf"%>
