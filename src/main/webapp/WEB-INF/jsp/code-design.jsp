<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
    uri="http://www.springframework.org/security/tags"%>
<%@ include file="../jspf/header.jspf"%>
<div class="jumbotron">
        <h1 class="display-4">Design your code</h1>
        <div class="row">
            <h3>From file</h3>
        </div>
        <div class="row">
            <div class="col-sm-3">
                Name: <input></input>
            </div>
            <div class="col-sm-1">
            </div>
            <div class="col-sm-8">
                <input type="file" class="file" name="inputFile" id="fileSent" data-error="No has especificado el fichero">
            </div>
        </div>
        <div class="row">
            <h3>Writing</h3>
        </div>
        <div class="row">
            <div class="col-sm-3">
                Name: <input></input>
            </div>
            <div class="col-sm-9">
            </div>
        </div>
        <div class="row">
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="10"></textarea>				
        </div>
        <div class="row">
                <div class="col-sm-4"></div>
                    <div class="col-sm-2">
                        <a href="/" type="button" class="btn btn-primary max_width results">Upload</a>		  		
                    </div>
                    <div class="col-sm-2">
                        <a href="/settings" type="button" class="btn btn-primary max_width results">Cancel</a>		  		
                    </div>
                    <div class="col-sm-4"></div>
                </div>
        </div>
    </div>
<%@ include file="../jspf/footer.jspf"%>