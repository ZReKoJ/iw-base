<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<link href="${s}/css/bootstrap-select.css" rel="stylesheet">
<script src="${s}/js/bootstrap-select.js"></script>

<!-- Tema del editor de codemirror -->
<link href="${s}/css/code-design-theme.css" rel="stylesheet">
<!-- Codemirror editor -->
<link href="${s}/css/codemirror.css" rel="stylesheet">

<form id="play-form" action="/playing" method="post" role="form">
	<div class = "row bigpaddingtop" >
		<div class="col-sm-4 no_margin">
	   		<h3 class="page-subtitle">Select Your Robot</h3>
			  <c:choose>
				<c:when test="${ownedCodes.size() > 0}">
					<select id="owned-codes" name="usercode" class="selectpicker show-tick" data-width="100%" data-live-search="true" data-max-options="1" multiple>
						<c:forEach var="code" items="${ownedCodes}">
							<option id="${code.id}" class="owned-codes-op" value='{"id": ${code.id}, "name": "${code.name}", "creatorId": ${code.creator.id}, "creatorName": "${code.creator.nickname}" }'>${code.name}</option>
						</c:forEach>
					</select>
				</c:when>
				<c:otherwise>
					<select id="owned-codes" class="selectpicker show-tick" data-width="100%" data-live-search="true" disabled>
						<option> No codes uploaded yet! </option>
					</select>
				</c:otherwise>
			  </c:choose>
			
		</div>
		
		<div class="col-sm-4 no_margin">
	   		<h3 class="page-subtitle">Select Map</h3>
				 <c:choose>
					<c:when test="${maps.size() > 0}">
						<select id="all-maps" name="map" class="selectpicker show-tick" data-width="100%"  data-live-search="true" data-max-options="1" multiple>
							<c:forEach var="map" items="${maps}">
								<option id="map-${map.id}" value='{"id": ${map.id}, "name": "${map.name}" }' data-subtext="${map.creator.nickname}">${map.name}</option>
							</c:forEach>
						</select>
					</c:when>
					<c:otherwise>
						<select id="all-maps" class="selectpicker show-tick" data-width="100%" data-live-search="true" disabled>
							<option> No maps uploaded yet! </option>
						</select>
					</c:otherwise>
				</c:choose>
		</div>
		
		<div class="col-sm-4 no_margin">
	   		<h3 class="page-subtitle">Select Enemy Robots</h3>
			   <c:choose>
					<c:when test="${codes.size() > 0}">
	  					<select id="all-codes" name="enemycodes" class="selectpicker show-tick" data-width="100%" data-live-search="true" data-hide-disabled="true" data-max-options="9" multiple>	
							<c:forEach var="code" items="${codes}">
								<option id="all-${code.id}" value='{"id": ${code.id}, "name": "${code.name}", "creatorId": ${code.creator.id}, "creatorName": "${code.creator.nickname}" }' data-subtext="${code.creator.nickname}">${code.name}</option>
							</c:forEach>
						</select>
					</c:when>
					<c:otherwise>
	  					<select id="all-codes" class="selectpicker show-tick" data-width="100%" data-live-search="true" disabled>
							<option> No codes uploaded yet! </option>
						</select>
					</c:otherwise>
				</c:choose>
		</div>
		
	</div>
	
	<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
	
	<div class="row">
		<div class="preview pull-left">
			<canvas id="canvas"></canvas>
		</div>
		<div class="preview pull-right">
        	<textarea id="codeText" name="code" class="codemirror-textarea"></textarea> 
        </div>
	</div>
	<hr class="my-4">
	<div class="row">
		<div class="warningText centered">DISCLAIMER: We take no responsibility on the effects that may cause executing javaScript code created by others in your own device.</div>
	</div>

	<div class="row">
		<div class="col-sm-5"></div>
		<div class="col-sm-2">
			<input type="submit" id="play-submit" name="play-submit" value="Play" class="btn btn-primary max_width" disabled>
		</div>
		<div class="col-sm-5"></div>
	</div>

</form>
<script>
    $( document ).ready(function() {
    	play();
    });
</script>

<script src="${s}/js/map-properties.js"></script>
<script src="${s}/js/battle-ground.js"></script>
<script src="${s}/js/codemirror.js"></script>
<script src="${s}/js/javascriptMode.js"></script>
<script src="${s}/js/play.js"></script>

<%@ include file="../jspf/footer.jspf"%>