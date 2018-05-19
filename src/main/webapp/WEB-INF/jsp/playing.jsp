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
		<div class="row">
			<div class="col-sm-2"></div>
			<div class="col-sm-8">
				<div id="rank" class="row">
		       	</div>
			</div>
			<div class="col-sm-2"></div>
		</div>
		<div class="row">
			<div class="col-sm-4"></div>
			<div class="col-sm-4">
				<div class=" btn-group-vertical">
					<a class="btn btn-primary btn-block disabled" id="playagain-button" href="play" role="button" >Play again</a>
					<a id="fullscreen" class="btn btn-primary btn-block" role="button">FullScreen</a>
				</div>
			</div>
			<div class="col-sm-4"></div>
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
