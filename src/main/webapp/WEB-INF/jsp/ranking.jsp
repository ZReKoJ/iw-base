<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<link href="${s}/css/ranking.css" rel="stylesheet">

<div class="jumbotron">

    <div class="page-title">Ranking</div>
    <hr class="my-4">
    <div class="row">
        <table>
        	<thead>
        		<tr>
					<th class ="rank">Rank</th>
					<th class ="name">Name</th>
					<th class="win">Win</th>
					<th class="lose">Lose</th>
				</tr>
        	</thead>
        	<tbody>
        	<c:forEach var="user" items="${users}" varStatus="status">
				<tr>
					<td class="rank"> ${status.index+1} </td>
					<td class="name"> ${user.nickname} </td>
					<td class="win"> ${user.win} </td>
					<td class="lose"> ${user.lose} </td>
            	</tr>
			</c:forEach>
			</tbody>
        </table>
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