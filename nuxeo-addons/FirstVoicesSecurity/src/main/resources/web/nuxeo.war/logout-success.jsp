<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page language="java"%>

<%@ page import="org.nuxeo.ecm.platform.web.common.vh.VirtualHostHelper" %>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%

String NUXEO_URL = VirtualHostHelper.getBaseURL(request);
String WEB_UI_URL = NUXEO_URL.replace("/nuxeo", "").replace("8080", "3001");

response.sendRedirect(WEB_UI_URL);
%>

<!DOCTYPE html>
<!--[if lte IE 8]>
<html class="lt-ie9  no-js" lang="en">
   <![endif]-->
<!--[if gt IE 8]><!-->
<html lang="en"  class="no-js">
	<!--<![endif]-->
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <title>FirstVoices - Login</title>
    <meta name="description" content="FirstVoices is a suite of web-based tools and services designed to support Indigenous people engaged in language archiving, language teaching and culture revitalization."/>
    <meta name="author" content="FPCC"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  </head>
  <body id="body">
    Redirecting...
  </body>
</html>
