<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<link href="${s}/css/playing.css" rel="stylesheet">

<div class="row" id="game-zone">
		
	<div class="col-sm-7">
        <canvas id="canvas"></canvas>
	</div>
	<div class="col-sm-5">
		<div class="row" style="margin-left: 1px;">
			<div id="rank" class="row">
	       	</div>
			<div class=" btn-group btn-group-justified">
				<a id="playagain-button" class="btn btn-primary btn-block disabled" href="play" role="button" >Play again</a>
				<a id="play-pause" class="btn btn-primary btn-block" role="button">Pause</a>
				<a id="fullscreen" class="btn btn-primary btn-block" role="button">FullScreen</a>
			</div>
			<div class="instructions">
  				<h1 class="display-4">Instructions</h1>
  				<hr class="my-4">
  				<p>- Follow: click on health bar of a robot to follow that robot</p>
	  			<p>- Pause: click on pause button to pause the game</p>
	  			<p>- Debug: press F12 to see the console logs</p>
	  			<p>- Zoom: use the mouse wheel next to map center to zoom in and out</p>
	  			<p>- Move map: use the mouse wheel far from map center to move the map</p>
	  			
			</div>
		</div>
	</div>
</div>

<script>
$( document ).ready(function() {
	playing(JSON.parse('${map}'), JSON.parse('${code}'), JSON.parse('${enemies}'));
});
</script>

<script src="${s}/js/map-properties.js"></script>
<script src="${s}/js/battle-ground.js"></script>
<script src="${s}/js/robot.js"></script>
<script src="${s}/js/playing.js"></script>
<%@ include file="../jspf/footer.jspf"%>
