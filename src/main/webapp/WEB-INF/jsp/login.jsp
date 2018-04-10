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
                        <a href="#" class="active" id="login-form-link">Login</a>
                    </div>
                    <div class="col-xs-6">
                        <a href="#" id="register-form-link">Register</a>
                    </div>
                </div>
                <hr>
            </div>
            <div class="panel-body">
                <form id="login-form" action="/login" method="post" role="form">
                    <div class="form-group">
                        <input class="form-control" type="text" id="username" name="username" placeholder="Username"/>
                    </div>
                    <div class="form-group">
                        <input class="form-control" type="password" id="password" name="password" placeholder="Password"/>
                    </div>
                    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
                    <div class="form-group text-center">
                        <input type="checkbox" tabindex="3" class="" name="remember" id="remember">
                        <label for="remember"> Remember Me</label>
                    </div>
                    <div class="form-group text-center">
                        <div class="row">
                            <div class="col-sm-6 col-sm-offset-3">
                                <input type="submit" name="login-submit" id="login-submit" tabindex="4" class="form-control btn btn-login" value="Log In">
                            </div>
                        </div>
                    </div>
                    <div class="form-group text-center">
                        <a href="#" tabindex="5" class="forgot-password">Forgot Password?</a>
                    </div>
                </form>
                <form id="register-form" action="/createUser" method="post" role="form" style="display: none;">
                    <div class="form-group">
                        <input class="form-control" type="text" id="username" name="nickname" placeholder="Username"/>
                    </div>
                    <div class="form-group">
                        <input class="form-control" type="password" id="password" name="password" placeholder="Password"/>
                    </div>
                    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
                    <div class="form-group">
                        <input type="password" name="confirmPassword" id="confirm-password" tabindex="2" class="form-control" placeholder="Confirm Password">
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
	login();
});
</script>

<%@ include file="../jspf/footer.jspf"%>