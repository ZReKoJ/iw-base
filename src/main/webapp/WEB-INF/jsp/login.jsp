<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>

<link href="${s}/css/login.css" rel="stylesheet">

<div class="row">
    <div class="col-md-6 col-md-offset-3">
        <div class="panel panel-login">
            <div class="panel-heading">
                <div class="row">
                    <div class="col-xs-6">
                        <a class="active" id="login-form-link">Login</a>
                    </div>
                    <div class="col-xs-6">
                        <a id="register-form-link">Register</a>
                    </div>
                </div>
                <hr>
            </div>
            <div class="panel-body">
                <form id="login-form" action="/login" method="post" role="form">
                    <div class="form-group">
                        <input id="logname" class="form-control" type="text" name="username" placeholder="Username" required/>
                    </div>
                    <div class="form-group">
                        <input id="logpass" class="form-control" type="password" name="password" placeholder="Password" required/>
                    </div>
                    <input id="logextra" type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
                    <div class="form-group text-center">
                        <div class="row">
                            <div class="col-sm-6 col-sm-offset-3">
                                <input type="submit" name="login-submit" id="login-submit" tabindex="4" class="form-control btn btn-login" value="Log In">
                            </div>
                        </div>
                    </div>
                </form>
                <form id="register-form" action="/createUser" method="post" role="form" style="display: none;">
                    <div class="form-group">
                        <input class="form-control" type="text" id="regname" name="nickname" placeholder="Username" required />
                    </div>
                    <div class="form-group">
                        <input class="form-control" type="password" id="regpass" name="password" placeholder="Password" required />
                    </div>
                    <input type="hidden" id="regextra" name="${_csrf.parameterName}" value="${_csrf.token}"/>
                    <div class="form-group">
                        <input type="password" name="confirmPassword" id="confirm-password" class="form-control" placeholder="Confirm Password" required>
                    </div>
                    <div class="form-group">
                        <div class="row">
                            <div class="col-sm-6 col-sm-offset-3">
                                <input type="submit" name="register-submit" id="register-submit" tabindex="4" class="form-control btn btn-register" value="Register Now">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
$( document ).ready(function() {
	login('${loginError}');
});
</script>

<script src="${s}/js/login.js"></script>
<%@ include file="../jspf/footer.jspf"%>