<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<link href="${s}/css/profile.css" rel="stylesheet">

<div class="row user-menu-container square whiteBg">
        <div class="col-md-7 user-details">
            <div class="row neutralColourDarkBg white">
                <img src="${s}/img/avatar.png" class="col-md-5">
                <div class="col-md-6 no-pad">
                    <div class="user-pad">
                        <h3>Welcome back, ${user.nickname}</h3>
                        <h4 class="white"><i class="fa fa-check-circle-o"></i>Platino</h4>
                    </div>
                </div>
            </div>
            <div class="row overview whiteBg">
                <div class="col-md-4 user-pad text-center">
                    <h3>WIN</h3>
                    <h4>${user.win}</h4>
                </div>
                <div class="col-md-4 user-pad text-center">
                    <h3>DRAW</h3>
                    <h4>${user.draw}</h4>
                </div>
                <div class="col-md-4 user-pad text-center">
                    <h3>LOSS</h3>
                    <h4>${user.lose}</h4>
                </div>
            </div>
        </div>
        <div class="col-md-2 user-menu-btns">
            <div class="btn-group-vertical square" id="responsive">
    			<a class="btn neutralColourLightBg active" href="#" role="button">History</a>
    			<a class="btn neutralColourLightBg" href="#" role="button">Account</a>
    			<a class="btn neutralColourLightBg" href="#" role="button">Codes</a>
    			<a class="btn neutralColourLightBg" href="#" role="button">Maps</a>
    			<a class="btn neutralColourLightBg" href="login" role="button">Logout</a>
    			<a class="btn neutralColourLightBg" href="/" role="button">Back</a>
            </div>
        </div>
        <div class="col-md-3 user-menu user-pad">
            <div class="user-menu-content active">
                <h3>
                    Recent Interactions
                </h3>
                <ul class="user-menu-list">
                    <li>
                        <h4><i class="fa fa-user coral"></i> Roselynn Smith followed you.</h4>
                    </li>
                    <li>
                        <h4><i class="fa fa-heart-o coral"></i> Jonathan Hawkins followed you.</h4>
                    </li>
                    <li>
                        <h4><i class="fa fa-paper-plane-o coral"></i> Gracie Jenkins followed you.</h4>
                    </li>
                    <li>
                        <button type="button" class="btn btn-labeled btn-success" href="#">
                            <span class="btn-label"><i class="fa fa-bell-o"></i></span>View all activity</button>
                    </li>
                </ul>
            </div>
            <div class="user-menu-content">
                <h3>
                    Your Inbox
                </h3>
                <ul class="user-menu-list">
                    <li>
                        <h4>From Roselyn Smith <small class="coral"><strong>NEW</strong> <i class="fa fa-clock-o"></i> 7:42 A.M.</small></h4>
                    </li>
                    <li>
                        <h4>From Jonathan Hawkins <small class="coral"><i class="fa fa-clock-o"></i> 10:42 A.M.</small></h4>
                    </li>
                    <li>
                        <h4>From Georgia Jennings <small class="coral"><i class="fa fa-clock-o"></i> 10:42 A.M.</small></h4>
                    </li>
                    <li>
                        <button type="button" class="btn btn-labeled btn-danger" href="#">
                            <span class="btn-label"><i class="fa fa-envelope-o"></i></span>View All Messages</button>
                    </li>
                </ul>
            </div>
            <div class="user-menu-content">
                <h3>
                    Codes
                </h3>
                <ul>
                	<c:choose>
						<c:when test="${codeListSize > 0}">
							<c:forEach var="code" items="${codes}">
								<li class="btn neutralColourLightBg">${code.name}</li>
							</c:forEach>
						</c:when>
						<c:otherwise>
							<p> No codes uploaded yet!
						</c:otherwise>
					</c:choose>
	                
				</ul>
	            
            </div>
            <div class="user-menu-content">
                <h2 class="text-center">
                   Maps
                </h2>
                <ul>
                <c:choose>
						<c:when test="${mapListSize > 0}">
							<c:forEach var="map" items="${maps}">
								<li class="btn neutralColourLightBg">${map.name}</li>
							</c:forEach>
						</c:when>
						<c:otherwise>
							<p> No maps uploaded yet!
						</c:otherwise>
					</c:choose>
                </ul>
            </div>
        </div>
    </div>
    
    <script>
	$( document ).ready(function() {
		profile();
	});
	</script>
	
<%@ include file="../jspf/footer.jspf"%>