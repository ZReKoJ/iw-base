<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<form>
	<div class = "row bigpaddingtop" >
		<div class="col-sm-4 no_margin">
	   		<h3 class="page-subtitle">Select Your Robot</h3>
	  		<select class="custom-select play-select" size="14">
			  <option value="1">One</option>
			  <option value="2">Two</option>
			  <option value="3">Three</option>
			  <option value="1">One</option>
			  <option value="2">Two</option>
			  <option value="3">Three</option>
			  <option value="1">One</option>
			  <option value="2">Two</option>
			  <option value="3">Three</option>
			  <option value="1">One</option>
			  <option value="2">Two</option>
			  <option value="3">Three</option>
			  <option value="1">One</option>
			  <option value="2">Two</option>
			  <option value="3">Three</option>
			</select>
		</div>
		
		
		<div class="col-sm-4 no_margin">
	   		<h3 class="page-subtitle">Select Map</h3>
	  		<select class="custom-select play-select" size="14">
			  <option value="1">One</option>
			  <option value="2">Two</option>
			  <option value="3">Three</option>
			</select>
		</div>
		
		
		<div class="col-sm-4 no_margin">
	   		<h3 class="page-subtitle">Select Enemy Robot</h3>
	  		<select class="custom-select play-select" size="14">
			  <option value="1">One</option>
			  <option value="2">Two</option>
			  <option value="3">Three</option>
			</select>
		</div>
		
	</div>

	<div class="row">
		<div class="col-sm-5"></div>
		<div class="col-sm-2">
			<a href="playing"><button type="button" class="btn btn-primary max_width">Pay</button></a>
		</div>
		<div class="col-sm-5"></div>
	</div>
</form>

<%@ include file="../jspf/footer.jspf"%>