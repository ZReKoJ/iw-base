<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>

<%@ include file="../jspf/header.jspf"%>

<div class="jumbotron">
	<h1 class="display-4">Winner: ZIHAO</h1>
	<hr class="my-4">
	<div class = "row">
		<div class="col-sm-1"></div>
		<div class="col-sm-4 card no_margin">
	  		<div class="card-body">
	   			<h3 class="card-title loser">Lorenzo</h3>
	  		</div>
	  		<label>Health </label>
	  		<div class="progress">
  				<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
  				</div>
			</div>
	  		<ul class="list-group list-group-flush">
	  		
	    		<li class="list-group-item">Items obtained: 3</li>
	    		<li class="list-group-item">Hits: 4</li>
	    		<li class="list-group-item">Skills used: 2</li>
	  		</ul>
	  		
		</div>
		<div class="col-sm-2"></div>
		<div class="col-sm-4 card no_margin">
	  		<div class="card-body">
	   			<h3 class="card-title winner">Zihao</h3>
	  		</div>
	  		<label>Health </label>
	  		<div class="progress">
  				<div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
  				</div>
			</div>
	  		<ul class="list-group list-group-flush">
	    		<li class="list-group-item">Items obtained: 7</li>
	    		<li class="list-group-item">Hits: 7</li>
	    		<li class="list-group-item">Skills used: 1</li>
	  		</ul>
	  		
		</div>
		<div class="col-sm-1"></div>
	</div>
	<div class="row">
		<div class="col-sm-5"></div>
		<div class="col-sm-2">
			<a href="/"><button type="button" class="btn btn-primary max_width">Home page</button></a>
		</div>
		<div class="col-sm-5"></div>
	</div>
	
</div>

<%@ include file="../jspf/footer.jspf"%>
