<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<link href="${s}/css/profile.css" rel="stylesheet">

<div class="row user-menu-container square whiteBg">
        <div class="col-md-7 user-details">
            <div class="row neutralColourDarkBg white">
            	<div class="col-md-3" class="circle-avatar">
            		<img src="avatar/${user.id}" class="circle-avatar">
            	</div>
            	<div class="col-md-9 no-pad">
                    <div class="user-pad">
                        <h3>Welcome back, ${user.nickname}</h3>
                    </div>
                </div>
            </div>
            <div class="row  neutralColourDarkBg">
            
            	<div class="col-sm-3">
            	<form action="/saveAvatar" enctype="multipart/form-data" method="post">
					<input type="file" name="photo" id="file" class="inputfile" onchange="form.submit()" />
					<label for="file">Change avatar</label>
					<input name="${_csrf.parameterName}" type="hidden" value="${_csrf.token}" />
				</form>
            	</div>
           		
            </div>
            <div class="row overview whiteBg">
                <div class="col-md-6 user-pad text-center">
                    <h3>WIN</h3>
                    <h4>${user.win}</h4>
                </div>
                
                <div class="col-md-6 user-pad text-center">
                    <h3>LOSS</h3>
                    <h4>${user.lose}</h4>
                </div>
            </div>
        </div>
        <div class="col-md-2 user-menu-btns">
            <div class="btn-group-vertical square" id="responsive">
    			<a class="btn neutralColourLightBg active" role="button">Chat</a>
    			<a class="btn neutralColourLightBg" role="button">Codes</a>
    			<a class="btn neutralColourLightBg" role="button">Maps</a>
    			<a class="btn neutralColourLightBg" onclick="logout()" role="button">Logout</a>
    			<a class="btn neutralColourLightBg" href="/" role="button">Back</a>
            </div>
        </div>
        <div class="col-md-3 user-menu user-pad">
            <div class="user-menu-content active">
                <textarea id="chat" readonly></textarea>
				<form id="escrito">
					<div class="input-group">
						<input id="send" type="text" class="form-control" placeholder="Mensaje">
						<span id="sendButton" class="input-group-btn">
							<div class="btn btn-default">
								<span class="glyphicon glyphicon-send"></span>
								<span>Send</span>
							</div>
						</span>
	        		</div>
				</form>
            </div>
            <div class="user-menu-content">
                <h3 class="centered">Your codes</h3>
                <c:choose>
					<c:when test="${myCodesSize > 0}">
							<c:forEach var="code" items="${myCodes}">
								<div class="row profile-list">
									<div class="col-sm-7">
										${code.name}
									</div>
									<div class="col-sm-2">
										<a href="code-design?codeId=${code.id }"> Edit </a>
									</div>
									<div class="col-sm-2">
										<a href="deleteCode?codeId=${code.id }"> Delete </a>
									</div>
								</div>
 							</c:forEach>	 
							
					</c:when>
					<c:otherwise>
						<p class="centered"> No codes uploaded yet!
						
					</c:otherwise>
				</c:choose>
	        </div>
            <div class="user-menu-content">
                <h3 class="centered">Your maps</h3>
                <c:choose>
					<c:when test="${myMapsSize > 0}">
					<c:forEach var="map" items="${myMaps}">
 								<div class="row profile-list">
									<div class="col-sm-7">
										${map.name}
									</div>
									<div class="col-sm-2">
										<a href="map-design?mapId=${map.id }"> Edit </a>
									</div>
									<div class="col-sm-2">
										<a href="deleteMap?mapId=${map.id }"> Delete </a>
									</div>
								</div>
 							</c:forEach>	 
					</c:when>
					<c:otherwise>
						<p class="centered"> No maps uploaded yet!
					</c:otherwise>
				</c:choose>
            </div>
        </div>
    </div>
    
    <script>
	$( document ).ready(function() {
		profile(new WebSocket("${endpoint}"));
	});
	</script>

<script src="${s}/js/profile.js"></script>
<%@ include file="../jspf/footer.jspf"%>