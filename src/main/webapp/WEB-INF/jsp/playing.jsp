<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<div class="jumbotron">
	<div class="row">
		<div class="column btn-group-vertical pull-right">
            <a class="btn btn-primary disabled" href="results" role="button">Results</a>
            <a id="fullscreen" class="btn btn-primary" href="#" role="button">FullScreen</a>
		</div>
		<div class="map-content">
        	<canvas id="canvas"></canvas>
        </div>
	</div>
</div>

<script>
$( document ).ready(function() {
	playing();
});
</script>

<%@ include file="../jspf/footer.jspf"%>
