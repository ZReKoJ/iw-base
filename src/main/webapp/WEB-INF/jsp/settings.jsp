<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<div class="jumbotron">
    <div class="row">
        <h1 class="display-4">Settings</h1>
    </div>
    <hr class="my-4">
    <div class="row">
        <div class="col-sm-4"></div>
        <div class="col-sm-4">
            <a href="/map-design" type="button" class="btn btn-primary max_width results">Create new map</a>		  		
        </div>
        <div class="col-sm-4"></div>
    </div>
    <div class="row">
        <div class="col-sm-4"></div>
        <div class="col-sm-4">
            <a href="/code-design" type="button" class="btn btn-primary max_width results">Create new code</a>		  		
        </div>
        <div class="col-sm-4"></div>
    </div>
    <div class="row">
        <div class="col-sm-4"></div>
        <div class="col-sm-4">
            <div class="col-sm-3">
                <button type="button" class="btn btn-primary max_width results">
                <span class="glyphicon glyphicon-music"></span>
                </button>
            </div>
            <div class="col-sm-3">
                <button type="button" class="btn btn-primary max_width results">
                <span class="glyphicon glyphicon-search"></span>
                </button>
            </div>
            <div class="col-sm-3">
                <button type="button" class="btn btn-primary max_width results">
                <span class="glyphicon glyphicon-heart"></span>
                </button>
            </div>
            <div class="col-sm-3">
                <button type="button" class="btn btn-primary max_width results">
                <span class="glyphicon glyphicon-thumbs-up"></span>
                </button>
            </div>
        </div>
        <div class="col-sm-4"></div>
    </div>
    
    <div class="row">
        <div class="col-sm-5"></div>
        <div class="col-sm-2">
            <a href="/"><button type="button" class="btn btn-primary max_width back">Back</button></a>
        </div>
        <div class="col-sm-5"></div>
    </div>
</div>

<%@ include file="../jspf/footer.jspf"%>