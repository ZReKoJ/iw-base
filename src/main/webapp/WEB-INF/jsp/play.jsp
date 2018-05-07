<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/css/bootstrap-select.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/js/bootstrap-select.min.js"></script>

<form>
	<div class = "row bigpaddingtop" >
		<div class="col-sm-4 no_margin">
	   		<h3 class="page-subtitle">Select Your Robot</h3>
			  <c:choose>
				<c:when test="${codeListSize > 0}">
					<select class="selectpicker show-tick" data-width="100%" data-live-search="true">
						<c:forEach var="code" items="${codes}">
							<option value="${code.name}">${code.name}</option>
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
					<c:when test="${mapListSize > 0}">
						<select class="selectpicker show-tick" data-width="100%" data-live-search="true">
							<c:forEach var="map" items="${maps}">
								<option value="${map.name}">${map.name}</option>
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
	  		<select class="selectpicker show-tick" data-width="100%" data-live-search="true" data-max-options="5" multiple>
			  <option value="1">Robot1</option>
			  <option value="2">Robot2</option>
			  <option value="3">Robot3</option>
			  <option value="4">Robot4</option>
			  <option value="5">Robot5</option>
			  <option value="6">Robot6</option>
			  <option value="7">Robot7</option>
			  <option value="8">Robot8</option>
			  <option value="9">Robot9</option>
			  <option value="10">Robot10</option>
			</select>
		</div>
		
	</div>

	<div class="row">
		<div class="col-sm-5"></div>
		<div class="col-sm-2">
			<a href="playing"><button type="button" class="btn btn-primary max_width">Play</button></a>
		</div>
		<div class="col-sm-5"></div>
	</div>
</form>

<%@ include file="../jspf/footer.jspf"%>