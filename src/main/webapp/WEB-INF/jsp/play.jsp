<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/css/bootstrap-select.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/js/bootstrap-select.min.js"></script>

<form id="play-form" action="/loadGame" method="post" role="form">
	<div class = "row bigpaddingtop" >
		<div class="col-sm-4 no_margin">
	   		<h3 class="page-subtitle">Select Your Robot</h3>
			  <c:choose>
				<c:when test="${ownedCodes.size() > 0}">
					<select name="user-code" class="selectpicker show-tick" data-width="100%" data-live-search="true">
						<c:forEach var="code" items="${ownedCodes}">
							<option value="${code.id}">${code.name}</option>
						</c:forEach>
					</select>
				</c:when>
				<c:otherwise>
					<select class="selectpicker show-tick" data-width="100%" data-live-search="true" disabled>
						<option> No codes uploaded yet! </option>
					</select>
				</c:otherwise>
			  </c:choose>
			
		</div>
		
		
		<div class="col-sm-4 no_margin">
	   		<h3 class="page-subtitle">Select Map</h3>
				 <c:choose>
					<c:when test="${maps.size() > 0}">
						<select name="map" class="selectpicker show-tick" data-width="100%" data-live-search="true">
							<c:forEach var="map" items="${maps}">
								<option value="${map.id}">${map.name}</option>
							</c:forEach>
						</select>
					</c:when>
					<c:otherwise>
						<select class="selectpicker show-tick" data-width="100%" data-live-search="true" disabled>
							<option> No maps uploaded yet! </option>
						</select>
					</c:otherwise>
				</c:choose>
		</div>
		
		
		<div class="col-sm-4 no_margin">
	   		<h3 class="page-subtitle">Select Enemy Robots</h3>
			   <c:choose>
					<c:when test="${codes.size() > 0}">
	  					<select name="enemy-codes[]" class="selectpicker show-tick" data-width="100%" data-live-search="true" data-max-options="5" multiple>	
							<c:forEach var="code" items="${codes}">
								<option value="${code.id}">${code.name}</option>
							</c:forEach>
						</select>
					</c:when>
					<c:otherwise>
	  					<select class="selectpicker show-tick" data-width="100%" data-live-search="true" data-max-options="5" multiple disabled>
							<option> No codes uploaded yet! </option>
						</select>
					</c:otherwise>
				</c:choose>
		</div>
		
	</div>

	<div class="row">
		<div class="col-sm-5"></div>
		<div class="col-sm-2">
			<input type="submit" id="play-submit" name="play-submit" value="Play" class="btn btn-primary max_width">
		</div>
		<div class="col-sm-5"></div>
	</div>
</form>

<%@ include file="../jspf/footer.jspf"%>