<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>

<%@ include file="../jspf/header.jspf"%>

<div class="row">
	<div class="row">
		<h1>Registro</h1>
	</div>
	
	    <form action="/login" method="post">               
	        <fieldset>
	            <div class="row">
	            	<div class=col-sm-4></div>
	            	<div class=col-sm-4>
	            		<div class="row">
	            			<p>Username</p>
	            		</div>
	            		<div class="row">
							<input class="width_80 form-control" type="text" id="username" name="username"/>		   				</div>
	            		</div>
	            	<div class=col-sm-4></div>
	            </div>
	            <div class="row">
	            	<div class=col-sm-4></div>
	            	<div class=col-sm-4>
	            		<div class="row">
	            			<p>Password</p>
	            		</div>
	            		<div class="row">
	            			<input class="width_80 form-control" type="password" id="password" name="password"/>
		   				</div>
	            	</div>
	            	<div class=col-sm-4></div>
	            </div>
	            <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
		        <div class="form-actions">
		            <div class="row">
		            	<div class="col-sm-5"></div>
		            	<div class="col-sm-2">
		            		<button type="submit" class="btn max_width_margintop10">Log in</button>
		            	</div>
		            	<div class="col-sm-5"></div>
		            </div>
	            </div>
	        </fieldset>
	    </form>

		<div class="row">
			<div class="col-sm-5"></div>
		    <div class="col-sm-2">
		 		<div class="max_width_margintop10 center">
					<%@ include file="../jspf/authinfo.jspf"%>	
				</div>
		    </div>
		   	<div class="col-sm-5"></div>
		</div>





		
</div>

<%@ include file="../jspf/footer.jspf"%>
