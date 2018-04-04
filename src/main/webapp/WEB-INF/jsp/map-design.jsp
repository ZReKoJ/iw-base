<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>
<script src="${s}/js/map-design.js"></script>
<div class="jumbotron">
        <h1 class="display-4">Design your map</h1>
        <hr class="my-4">
        <div class="col-sm-2">
            <ul class="list-group list-map-design text-center">
                <li class="list-group-item">
                    <img src="${s}/img/map/trees.png" class="icon"></img>
                </li>
                <li class="list-group-item">
                    <img src="${s}/img/map/wall_brick.png" class="icon"></img>
                </li>
                <li class="list-group-item">
                    <img src="${s}/img/map/wall_steel.png" class="icon"></img>
                </li>
                <li class="list-group-item">
                    <img src="${s}/img/map/water_1.png" class="icon"></img>
                </li>
            </ul>
        </div>
        <div class="col-sm-9">
            <canvas id="mapBuilder"></canvas>
            <div class="btn-toolbar pull-right">
		    	<a class="btn btn-primary" href="/" onclick="javascript:alert('not implemented yet !!');" role="button">Upload</a>
		        <a class="btn btn-primary" href="/settings" role="button">Cancel</a>
		    </div>
        </div>
</div>
<%@ include file="../jspf/footer.jspf"%>