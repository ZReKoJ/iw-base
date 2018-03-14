<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
    uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>
<div class="jumbotron">
    <h1 class="display-4">RobotMaster7</h1>
    <hr class="my-4">
    <div class="row">
    <div class="col-sm-2"> </div>
     <div class="col-sm-3">
      <img src="http://santetotal.com/wp-content/uploads/2014/05/default-user.png" class="img-fluid" style="width:100%">
     </div>
     <div class="col-sm-5">
        <ul class="list-group list-group-flush">
         	<li class="list-group-item d-flex justify-content-between"> 
            	<div class="row">
            		<div class="col-sm-4"> Name: </div> <div class="col-sm-8 tright"> Lorenzo Leal Jimenez</div>
            	</div>
            </li>
            <li class="list-group-item d-flex justify-content-between"> 
            	<div class="row">
            		<div class="col-sm-4"> Score: </div> <div class="col-sm-8 tright"> 234435</div>
            	</div>
            </li>
            <li class="list-group-item d-flex justify-content-between"> 
            	<div class="row">
            		<div class="col-sm-4"> Rank: </div> <div class="col-sm-8 tright"> 2</div>
            	</div>
            </li>
           <li class="list-group-item d-flex justify-content-between"> 
            	<div class="row">
            		<div class="col-sm-4"> Location: </div> <div class="col-sm-8 tright"> Spain</div>
            	</div>
            </li>
           <li class="list-group-item d-flex justify-content-between"> 
            	<div class="row">
            		<div class="col-sm-4"> Robot: </div> <div class="col-sm-8 tright"> SuperRobot9000</div>
            	</div>
            </li>
            <li class="list-group-item d-flex justify-content-between"> 
            	<div class="row">
            		<div class="col-sm-4"> User since: </div> <div class="col-sm-8 tright"> 20/3/1647</div>
            	</div>
            </li>
        </ul>
    </div>
    <div class="col-sm-2"> </div>
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