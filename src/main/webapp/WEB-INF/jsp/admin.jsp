<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<link href="${s}/css/admin.css" rel="stylesheet">

<div class="starter-template">
	<h1>Admin</h1>
	<p class="page-title">Admin page</p>
	
	<hr/>
	
	<table>
	<thead>
	<tr><th>id<th>login<th>roles</tr>
	</thead>
	<tbody>
	<c:forEach items="${users}" var="u">
		<tr>
		<td>${u.id}<td>${u.nickname}<td>${u.roles}
		</tr>	
	</c:forEach>
	</tbody>
	</table>
	
	<table>
	<thead>
	<tr><th>id<th>mapName<th>creator</tr>
	</thead>
	<tbody>
	<c:forEach items="${maps}" var="map">
		<tr>
		<td>${map.id}<td>${map.name}<td>${map.creator.id}
		</tr>	
	</c:forEach>
	</tbody>
	</table>
	
	<table>
	<thead>
	<tr><th>id<th>codeName<th>creator</tr>
	</thead>
	<tbody>
	<c:forEach items="${codes}" var="code">
		<tr>
		<td>${code.id}<td>${code.name}<td>${code.creator.id}
		</tr>	
	</c:forEach>
	</tbody>
	</table>
</div>

<%@ include file="../jspf/footer.jspf"%>
