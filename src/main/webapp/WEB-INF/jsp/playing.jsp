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
		<div class="row">
			<div class="col-sm-2"></div>
			<div class="col-sm-8">
				<ul class="list-group" id="rank">
		  			
				</ul>
			</div>
			<div class="col-sm-2"></div>
		</div>
		<div class="row">
			<div class="col-sm-4"></div>
			<div class="col-sm-4">
				<div class=" btn-group-vertical width-100">
					<a class="btn btn-primary disabled" id="playagain-button" href="play" role="button" >Play again</a>
					<a id="fullscreen" class="btn btn-primary" href="#" role="button">FullScreen</a>
				</div>
			</div>
			<div class="col-sm-4"></div>
		</div>
	</div>
</div>

<script>
$( document ).ready(function() {
	playing('${mapId}', '${codeId}', JSON.parse('${enemyIds}'));
});
</script>

<script src="${s}/js/map-properties.js"></script>
<script src="${s}/js/battle-ground.js"></script>
<script src="${s}/js/robot.js"></script>
<script src="${s}/js/playing.js"></script>
<%@ include file="../jspf/footer.jspf"%>
