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
            <li class="list-group-item d-flex justify-content-between align-items-center">1 - Zihao
                <span class="badge badge-primary badge-pill">4334634</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">2 - Lorenzo
                <span class="badge badge-primary badge-pill">234435</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">3 - Cesar
                <span class="badge badge-primary badge-pill">143463</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">4 - AAAA
                <span class="badge badge-primary badge-pill">43123</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">5 - BBBB
                <span class="badge badge-primary badge-pill">35223</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">6 - CCCC
                <span class="badge badge-primary badge-pill">2233</span>
            </li>
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