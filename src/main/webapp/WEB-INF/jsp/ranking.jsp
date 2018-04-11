<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<div class="jumbotron">
    <h1 class="display-4">Ranking</h1>
    <hr class="my-4">
    <div class="row">
        <ul class="list-group list-group-flush">
        	<c:forEach var="user" items="${users}" varStatus="status">
				<li class="list-group-item d-flex justify-content-between align-items-center">${status.index+1} - ${user.nickname}
                	<span class="badge badge-primary badge-pill">${user.score}</span>
            	</li>
			</c:forEach>
        </ul>
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