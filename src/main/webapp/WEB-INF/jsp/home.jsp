<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<link href="${s}/css/home.css" rel="stylesheet">

<div class='menu closed'>
    <a class='profile button'></a>
    <a class='ranking button'></a>
    <a href="play" class='play button'> Play </a>
    <a class='code button'></a>
    <a class='mapd button'></a>
    <div class='main button homeMenu'> Menu </div>
</div>
<div class="titlecontainer">
    <div class="titlename"> ROBOTRON 2000 </div>
    <div class="titletext"> Develop a robot to battle against other robots. Show off your mad Javascript skills, try yourself against the best of the best.</div>
    	
</div>

<script>
    $( document ).ready(function() {
    	home();
    });
</script>

<script src="${s}/js/home.js"></script>
<%@ include file="../jspf/footer.jspf"%>