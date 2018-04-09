<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>

<%@ include file="../jspf/header.jspf"%>
<script src="${s}/js/playing.js"></script>

<div class="jumbotron">
	<div class="row">
		<div class="col-sm-3 card no_margin">
		  		<div class="card-body">
		   			<h3 class="card-title">Lorenzo</h3>
		  		</div>
		  		<label>Health </label>
		  		<div class="progress">
	  				<div class="progress-bar" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
					
				</div>
				<p class="countdown"> -1/5s </p>
		  		<ul class="list-group list-group-flush">
		  		
		    		<li class="list-group-item">Items obtained: 0</li>
		    		<li class="list-group-item">Hits: 0</li>
		    		<li class="list-group-item">Skills used: 0</li>
		  		</ul>
		  		
			</div>
		<div class="col-sm-6">
            <canvas id="mapBuilder"></canvas>
		</div>
		<div class="col-sm-3 card no_margin">
		  		<div class="card-body">
		   			<h3 class="card-title">Zihao</h3>
		  		</div>
		  		<label>Health </label>
		  		<div class="progress">
	  				<div class="progress-bar" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
	  				
				</div>
				<p class="countdown"> -1/5s </p>
		  		<ul class="list-group list-group-flush">
		  		
		    		<li class="list-group-item">Items obtained: 0</li>
		    		<li class="list-group-item">Hits: 0</li>
		    		<li class="list-group-item">Skills used: 0</li>
		  		</ul>
		  		
			</div>
		
	</div>
	<div class="row">
		<div class="col-sm-5"></div>
		<div class="col-sm-2">
			<a href="results"><button type="button" class="btn btn-primary max_width results">Results</button></a>
		</div>
		<div class="col-sm-5"></div>
	</div>
</div>

<%@ include file="../jspf/footer.jspf"%>
