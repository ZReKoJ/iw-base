<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>
	
<link href="${s}/css/home.css" rel="stylesheet">
	<div class='menu closed'>
	  <a class='profile button'></a>
	  <a class='ranking button'></a>
	  <a href="playing" class='play button'> Play </a>
	  <a class='code button'></a>
	  <a class='mapd button'></a>
	  <div class='main button'> Menu </div>
	</div>
<div class="titlecontainer">
	<div class="titlename"> ROBOTRON 2000 </div>
	<div class="titletext"> Develop a robot to battle against other robots. Show off your mad Javascript skills, try yourself against the best of the best.</div>
</div>
<script>
    $(".main.button").mousedown(function(){
	$(".menu").toggleClass("closed");
	
	if($(".menu").hasClass("closed")) {
		$(".main.button").text("Menu");
		$(".profile.button").text(" ");
		$(".ranking.button").text(" ");
		$(".code.button").text(" ");
		$(".mapd.button").text(" ");
		$(".profile.button").removeAttr("href");
		$(".ranking.button").removeAttr("href");
		$(".code.button").removeAttr("href");
		$(".mapd.button").removeAttr("href");
	} else {
		$(".main.button").text("Close");
		$(".profile.button").text("Profile");
		$(".ranking.button").text("Ranking");
		$(".code.button").text("Code Design");
		$(".mapd.button").text("Map Design");
		$(".profile.button").attr("href", "profile");
		$(".ranking.button").attr("href", "ranking");
		$(".code.button").attr("href", "code-design");
		$(".mapd.button").attr("href", "map-design");
		
	}
})
</script>
<!--
<div class="jumbotron">
  <h1 class="display-4">Welcome to Robotrón 2000!</h1>
  <p>A simple game where you can have fun and learn Javascript at the same time</p>
  <p class="lead">
    <a class="btn btn-primary btn-lg play-button" href="playing" role="button">Play</a>
  </p>
  <hr class="my-4">
  <div class="row">
  <div class="col-sm-3"></div>
  <div class="col-sm-2">
  	<a href="settings"><button class="btn-block btn btn-info">Settings</button></a>
  </div>
  <div class="col-sm-2">
  	<a href="ranking"><button class="btn-block btn btn-info">Ranking</button></a>
  </div>
  <div class="col-sm-2">
  	<a href="profile"><button class="btn-block btn btn-info">Profile</button></a>
  </div>
  <div class="col-sm-3"></div>
  </div>
</div>

<!-- <div class="jumbotron">
	<div class="row">
		<h1 class="display-4 text-center">Nombre del Juego</h1> 
	</div>
	
<div class="row">
	<div class="col-sm-3"></div>
	<div class="col-sm-6">
          <img src="https://www.publicdomainpictures.net/pictures/200000/velka/car-silhouette-logo-symbol.jpg" class="img-fluid" style="width:100%">
	</div>
	<div class="col-sm-3"></div>
</div>
	
<div class="row">
	<div class="col-sm-3"></div>
	<div class="col-sm-6">
		<a href="playing"><button type="button" class="btn-block btn btn-info">Play</button></a>
	</div>
	<div class="col-sm-3"></div>
</div>
	
	<div class="row">
		<div class="col-sm-3"></div>
		<div class="col-sm-2">
			<a href="code-design"><button class="btn btn-outline btn-block" id="settings" type="button">Settings</button></a>
		</div>
		<div class="col-sm-2">
			<button class="btn btn-outline btn-block" id="scores" type="button">Scores</button>
		</div>
		<div class="col-sm-2">
			<a href="map-design"><button class="btn btn-outline btn-block" type="button">Map Design</button></a>
		</div>
		<div class="col-sm-3"></div>
	</div>
</div>
 -->
<%@ include file="../jspf/footer.jspf"%>
