<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>


	<div class="row" id="game-zone">
		
		<div class="col-sm-7">
        	<canvas id="canvas"></canvas>
        </div>
        <div class="col-sm-5">
	        
	        <div class="row stats-cards">
	        	<div class="col-sm-6">
	        			<div class="card stat-card width-100">
						 	<img class="card-img-top image-card" src="${s}/img/avatar.png" alt="Card image cap">
						 	<div class="card-body">
						  		<h5 class="card-title title-card">Zihao</h5>
						  	</div>
						  	<ul class="list-group list-group-flush list-card">
						   		<li class="list-group-item">HP: 100</li>
						   		<li class="list-group-item">Attack: 100</li>
						    	<li class="list-group-item">Bullets: 4</li>
						  	</ul>
							
						</div>
	        	</div>
	        	<div class="col-sm-6">
	        	
	        			<div class="card stat-card width-100">
						 	<img class="card-img-top image-card" src="${s}/img/avatar.png" alt="Card image cap">
						 	<div class="card-body">
						  		<h5 class="card-title title-card">Lorenzo</h5>
						  	</div>
						  	<ul class="list-group list-group-flush list-card">
						   		<li class="list-group-item">HP: 100</li>
						   		<li class="list-group-item">Attack: 100</li>
						    	<li class="list-group-item">Bullets: 4</li>
						  	</ul>
							
						</div>
	        	
	        </div>
		</div>
		<div class="row stats-cards">
	        	<div class="col-sm-6">
	        			<div class="card stat-card width-100">
						 	<img class="card-img-top image-card" src="${s}/img/avatar.png" alt="Card image cap">
						 	<div class="card-body">
						  		<h5 class="card-title title-card">César</h5>
						  	</div>
						  	<ul class="list-group list-group-flush list-card">
						   		<li class="list-group-item">HP: 100</li>
						   		<li class="list-group-item">Attack: 100</li>
						    	<li class="list-group-item">Bullets: 4</li>
						  	</ul>
							
						</div>
	        	</div>
	        	<div class="col-sm-6">
	        		
	        			<div class="card stat-card width-100">
						 	<img class="card-img-top image-card" src="${s}/img/avatar.png" alt="Card image cap">
						 	<div class="card-body">
						  		<h5 class="card-title title-card">Ceabaru</h5>
						  	</div>
						  	<ul class="list-group list-group-flush list-card">
						   		<li class="list-group-item">HP: 100</li>
						   		<li class="list-group-item">Attack: 100</li>
						    	<li class="list-group-item">Bullets: 4</li>
						  	</ul>
							
					
	        	</div>
	        </div>
		</div>
		<div class="row">
	        	<div class="col-sm-4"></div>
	        	<div class="col-sm-4">
	        		<div class=" btn-group-vertical width-100">
	        			<a class="btn btn-primary disabled" href="results" role="button">Results</a>
           	 			<a id="fullscreen" class="btn btn-primary" href="#" role="button">FullScreen</a>
	        		</div>
	        	</div>
	        	<div class="col-sm-4"></div>
	        </div>
	</div>
</div>

<script>
$( document ).ready(function() {
	playing();
});
</script>

<%@ include file="../jspf/footer.jspf"%>
