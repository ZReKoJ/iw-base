<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<link href="${s}/css/profile.css" rel="stylesheet">

<div class="row user-menu-container square whiteBg">
        <div class="col-md-7 user-details">
            <div class="row neutralColourDarkBg white">
            	<div class="col-md-4" class="circle-avatar">
            		
            		<form action="/saveAvatar" enctype="multipart/form-data" method="post">
            			<span class="userProfilePic">
            			 <label for="file">
							
							<img id="userProfilePicture" class="icon rounded" src="avatar/${user.id}" />
					    </label>
		                	<input type="file" name="photo" id="file" class="inputfile" onchange="form.submit()" />
		                	<input name="${_csrf.parameterName}" type="hidden" value="${_csrf.token}" />
		                </span>
		             
	                </form>
            	</div>
            	<div class="col-md-8 no-pad">
                    <div class="user-pad">
                        <h3>Welcome back, ${user.nickname}</h3>
                    </div>
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
    			<a class="btn neutralColourLightBg" role="button">Logout</a>
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
            <div class="user-menu-content" style="overflow:scroll; height:260px;">
                <h3 class="centered">Your codes</h3>
                <c:choose>
					<c:when test="${myCodesSize > 0}">
							<c:forEach var="code" items="${myCodes}">
								<div class="row profile-list">
									<div class="col-sm-5">
										${code.name}
									</div>
									<div class="col-sm-3">
										<a href="code-design?id=${code.id }"> Edit </a>
									</div>
									<div class="col-sm-4">
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
            <div class="user-menu-content" style="overflow:scroll; height:260px;">
                <h3 class="centered">Your maps</h3>
                <c:choose>
					<c:when test="${myMapsSize > 0}">
					<c:forEach var="map" items="${myMaps}">
 								<div class="row profile-list">
									<div class="col-sm-5">
										${map.name}
									</div>
									<div class="col-sm-3">
										<a href="map-design?id=${map.id }"> Edit </a>
									</div>
									<div class="col-sm-4">
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
            <div class="user-menu-content">
                <h3 class="centered">Are you sure you want to logout?</h3>
                <div class="btn-group btn-group-justified">
                    <a class="btn btn-primary" role="button" onclick="logout()">Yes</a>
                    <a class="btn btn-primary" href="profile" role="button">No</a>
                </div>
            </div>
        </div>
    </div>
    
    <script>
	$( document ).ready(function() {
		profile(new WebSocket("${endpoint}"), "${deletedName}");
	});
	</script>

<script src="${s}/js/profile.js"></script>
<%@ include file="../jspf/footer.jspf"%>