<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<link href="${s}/css/map-design.css" rel="stylesheet">


<div class="jumbotron">
    <div class="page-title">Design your map</div>
    <hr class="my-4">
    <input type="text" id="mapFileName" name="mapFileName" class="form-control" placeholder="Set the name for your map">
    <div class="input-group mb-3">
        <span class="input-group-btn">
        <button type="button" class="btn btn-danger btn-number"  data-type="minus" data-field="rows">
        <span class="glyphicon glyphicon-minus"></span>
        </button>
        </span>
        <input type="text" name="rows" class="form-control input-number" value="10" min="10" max="100">
        <span class="input-group-btn">
        <button type="button" class="btn btn-success btn-number" data-type="plus" data-field="rows">
        <span class="glyphicon glyphicon-plus"></span>
        </button>
        </span>
        <span class="input-group-btn">
        <button id="resize" type="button" class="btn btn-primary">&lt= ROWS Resize COLS =&gt</button>
        </span>
        <span class="input-group-btn">
        <button type="button" class="btn btn-danger btn-number"  data-type="minus" data-field="cols">
        <span class="glyphicon glyphicon-minus"></span>
        </button>
        </span>
        <input type="text" name="cols" class="form-control input-number" value="10" min="10" max="100">
        <span class="input-group-btn">
        <button type="button" class="btn btn-success btn-number" data-type="plus" data-field="cols">
        <span class="glyphicon glyphicon-plus"></span>
        </button>
        </span>
    </div>
    <div class="row">
        <div id="grid-element">
        </div>
        <div class="map-content">
            <canvas id="canvas" name="canvas"></canvas>
            <input name="${_csrf.parameterName}" type="hidden" value="${_csrf.token}" />
        </div>
    </div>
    <div class="row">
        <div class="btn-toolbar pull-right">
            <a id="upload" class="btn btn-primary" role="button">Upload</a>
            <a class="btn btn-primary" href="/" role="button">Cancel</a>
        </div>
    </div>
</div>
<script>
    $( document ).ready(function() {
    	mapDesign('${mapId}');
    });
</script>

<script src="${s}/js/map-properties.js"></script>
<script src="${s}/js/battle-ground.js"></script>
<script src="${s}/js/map-design.js"></script>
<%@ include file="../jspf/footer.jspf"%>