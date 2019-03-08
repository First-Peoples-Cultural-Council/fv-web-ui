<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page language="java"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Locale"%>
<%@ page import="org.joda.time.DateTime"%>
<%@ page import="org.nuxeo.ecm.platform.ui.web.auth.LoginScreenHelper"%>
<%@ page import="org.nuxeo.ecm.platform.ui.web.auth.NXAuthConstants"%>
<%@ page import="org.nuxeo.ecm.platform.ui.web.auth.NuxeoAuthenticationFilter"%>
<%@ page import="org.nuxeo.ecm.platform.ui.web.auth.service.LoginProviderLink"%>
<%@ page import="org.nuxeo.ecm.platform.ui.web.auth.service.LoginScreenConfig"%>
<%@ page import="org.nuxeo.ecm.platform.web.common.admin.AdminStatusHelper"%>
<%@ page import="org.nuxeo.common.Environment"%>
<%@ page import="org.nuxeo.runtime.api.Framework"%>
<%@ page import="org.nuxeo.ecm.platform.ui.web.auth.service.LoginVideo" %>
<%@ page import="org.nuxeo.ecm.platform.web.common.vh.VirtualHostHelper" %>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%
String productName = Framework.getProperty(Environment.PRODUCT_NAME);
String productVersion = Framework.getProperty(Environment.PRODUCT_VERSION);
String testerName = Framework.getProperty("org.nuxeo.ecm.tester.name");
boolean isTesting = "Nuxeo-Selenium-Tester".equals(testerName);
String context = request.getContextPath();

String NUXEO_URL = VirtualHostHelper.getBaseURL(request);
String WEB_UI_URL = NUXEO_URL.replace("/nuxeo", "").replace("8080", "3001");

/*

DY - Do not redirect on this page
HttpSession httpSession = request.getSession(false);
if (httpSession!=null && httpSession.getAttribute(NXAuthConstants.USERIDENT_KEY)!=null) {
  response.sendRedirect(context + "/" + NuxeoAuthenticationFilter.DEFAULT_START_PAGE);
}
*/

/* DY - Reset user JSESSIONID on this page so that login can start from scratch */

Cookie cookie = null;
Cookie[] cookies = null;

// Get an array of Cookies associated with the this domain
cookies = request.getCookies();

boolean JSESSIONIDExists = false;

if( cookies != null ) {
   for (int i = 0; i < cookies.length; i++) {
      cookie = cookies[i];
      if (cookie.getName( ).equals("JSESSIONID")) {
        JSESSIONIDExists = true;
      }
   }

   if (JSESSIONIDExists) {
    Cookie resetJSESSIONID = new Cookie("JSESSIONID", null);
    resetJSESSIONID.setMaxAge(0);
    resetJSESSIONID.setPath("/nuxeo/");
    response.addCookie(resetJSESSIONID);
   }
}

Locale locale = request.getLocale();
String selectedLanguage = locale.getLanguage();

boolean maintenanceMode = AdminStatusHelper.isInstanceInMaintenanceMode();
String maintenanceMessage = AdminStatusHelper.getMaintenanceMessage();

LoginScreenConfig screenConfig = LoginScreenHelper.getConfig();
List<LoginProviderLink> providers = screenConfig.getProviders();
boolean useExternalProviders = providers!=null && providers.size()>0;

// fetch Login Screen config and manage default
boolean showNews = screenConfig.getDisplayNews();
String iframeUrl = screenConfig.getNewsIframeUrl();

String loginButtonBackgroundColor = LoginScreenHelper.getValueWithDefault(screenConfig.getLoginButtonBackgroundColor(), "#ff452a");
String headerStyle = LoginScreenHelper.getValueWithDefault(screenConfig.getHeaderStyle(), "");
String loginBoxBackgroundStyle = LoginScreenHelper.getValueWithDefault(screenConfig.getLoginBoxBackgroundStyle(), "none repeat scroll 0 0");
String footerStyle = LoginScreenHelper.getValueWithDefault(screenConfig.getFooterStyle(), "");
boolean disableBackgroundSizeCover = Boolean.TRUE.equals(screenConfig.getDisableBackgroundSizeCover());
String fieldAutocomplete = screenConfig.getFieldAutocomplete() ? "on" : "off";

String logoWidth = LoginScreenHelper.getValueWithDefault(screenConfig.getLogoWidth(), "113");
String logoHeight = LoginScreenHelper.getValueWithDefault(screenConfig.getLogoHeight(), "20");
String logoAlt = LoginScreenHelper.getValueWithDefault(screenConfig.getLogoAlt(), "Nuxeo");
String logoUrl = LoginScreenHelper.getValueWithDefault(screenConfig.getLogoUrl(), context + "/img/login_logo.png");
String currentYear = new DateTime().toString("Y");

boolean hasVideos = screenConfig.hasVideos();
String muted = screenConfig.getVideoMuted() ? "muted " : "";
String loop = screenConfig.getVideoLoop() ? "loop " : "";
%>

<fmt:setBundle basename="messages" var="messages"/>

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
		<style type='text/css'>
			body{
				margin:0;
				font-family: Arial, sans-serif;
				color: #101010;
				line-height: 24px;
			}

			h1{
				font-weight: 900;
				font-size: 24px;
			}

			.container-box{
				border: 1px #010101 solid;
				width: 100%;
				max-width: 650px;
				margin: 15px auto;
				text-align: center;
			}

			form.fv-form input{
				border: 1px solid #a9a9a9;
				font-size: 18px;
				margin: 5px;
				padding: 2px;
				width: 300px;
      }

      .feedbackMessage{
        text-align:center;
        width:100%;
      }

      .login_button{
        text-transform: uppercase;
        background: #b6020e;
        border-radius: 5px;
        padding: 5px;
        color:#fff;
      }
    .buttonLink{
        background-color: #4e4e4e;
        color: #fff;
        padding: 8px 15px;
        border-radius: 10px;
        margin-right: 15px;
        text-decoration: none;
    }

    .buttonLink:hover{
        background-color: #4c7784;
    }
		</style>
    <link rel="shortcut icon" href="<%=WEB_UI_URL%>assets/images/favicon.ico" />


		<script type="text/javascript">
			function validateUserNameForCommonIssues() {
        var usernameFieldInputValue = document.getElementById("username").value;
        var hintMessageBox = document.getElementById("hintMessageJS");


        // Very simple check for missing @ sign
        if (usernameFieldInputValue != "" && usernameFieldInputValue.indexOf("@") == -1) {
          hintMessageBox.innerHTML = "Remember: In most cases your username will be your email...";
        } else {
          hintMessageBox.innerHTML = "";
        }

				return true;

			}
		</script>

  </head>
  <body id="body">

	<div class="container-box">

		<div data-component-id="AppBar" style="background-color:#b40000;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;box-sizing:border-box;font-family:Arial, sans-serif;-webkit-tap-highlight-color:rgba(0,0,0,0);box-shadow:0 1px 6px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.12);border-radius:0px;position:relative;z-index:1100;width:100%;display:flex;min-height:64px;padding-left:24px;padding-right:24px;" data-reactid=".0.0.1.0.0">
			<div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0;padding-top:15px;letter-spacing:0;font-size:24px;font-weight:400;color:#ffffff;line-height:64px;box-flex:1;flex:1;" data-reactid=".0.0.1.0.0.1"><span class="hidden-xs" data-reactid=".0.0.1.0.0.1.0"><img src="<%=WEB_UI_URL%>assets/images/logo.png" style="padding:0 0 5px 0;" alt="FirstVoices" data-reactid=".0.0.1.0.0.1.0.0"></span></div>
		</div>
			<div style="margin-bottom:15px;text-align:center;">
				<h1 style="font-weight:500;">Already a member? Log into FirstVoices</h1>

				<div>

            <form class="fv-form" method="post" action="nxstartup.faces" autocomplete="<%= fieldAutocomplete %>">
						<div style="color: blue; font-weight: bold;" class="hintMessage" id="hintMessageJS">
						</div>
						<div style="color: red; font-weight: bold;" class="errorMessage" id="errorMessage">

                <table width="100%">
                    <tr>
                        <td>
                            <c:if test="${param.connectionFailed}">
                                <div class="feedbackMessage errorMessage">
                                    <fmt:message bundle="${messages}" key="label.login.connectionFailed" />
                                </div>
                            </c:if>
                            <c:if test="${param.loginFailed == 'true' and param.connectionFailed != 'true'}">
                                <div class="feedbackMessage errorMessage">
                                    You've entered the wrong username or password.<br/>Please try again, use "Forgot your password?" link below or contact us.
                                </div>
                            </c:if>
                            <c:if test="${param.loginMissing}">
                                <div class="feedbackMessage errorMessage">
                                    <fmt:message bundle="${messages}" key="label.login.missingUsername" />
                                </div>
                            </c:if>
                            <c:if test="${param.securityError}">
                                <div class="feedbackMessage errorMessage">
                                    <fmt:message bundle="${messages}" key="label.login.securityError" />
                                </div>
                            </c:if>
                        </td>
                    </tr>
                </table>

						</div>
						<div class="infoMessage">
                    <!-- To prevent caching -->
                    <%
                    response.setHeader("Cache-Control", "no-cache"); // HTTP 1.1
                    response.setHeader("Pragma", "no-cache"); // HTTP 1.0
                    response.setDateHeader("Expires", -1); // Prevents caching at the proxy server
                    %>
                    <!-- ;jsessionid=<%=request.getSession().getId()%> -->
                    <!-- ImageReady Slices (login_cutted.psd) -->

                    <% if (maintenanceMode) { %>
                    <div class="maintenanceModeMessage">
                        <div class="warnMessage">
                            <fmt:message bundle="${messages}" key="label.maintenancemode.active" /><br/>
                            <fmt:message bundle="${messages}" key="label.maintenancemode.adminLoginOnly" />
                        </div>
                        <div class="infoMessage">
                            <fmt:message bundle="${messages}" key="label.maintenancemode.message" /> : <br/>
                            <%=maintenanceMessage%>
                        </div>
                    </div>
                    <%} %>
						</div>
				<div>
            <input onBlur="return validateUserNameForCommonIssues();" class="login_input" required type="text" name="user_name" id="username" placeholder="<fmt:message bundle="${messages}" key="label.login.username" />"/>
					<i class="icon-key"></i>
				</div>
				<div>
            <input class="login_input" required type="password" name="user_password" id="password" placeholder="<fmt:message bundle="${messages}" key="label.login.password" />">
					<i class="icon-key"></i>
				</div>
				<div>
            <input type="hidden" name="backTo"
                   id="backTo" value="${fn:escapeXml(param.backTo)}" />
            <input type="hidden" name="requestedUrl"
                   id="requestedUrl" value="${fn:escapeXml(param.requestedUrl)}" />
            <input type="hidden" name="forceAnonymousLogin"
                   id="true" />
            <input type="hidden" name="form_submitted_marker"
                   id="form_submitted_marker" />
            <input class="login_button" type="submit" name="Submit"
                   value="<fmt:message bundle="${messages}" key="label.login.logIn" />" />
				</div>
			</form>

			<div style="text-align: center;padding: 20px 0 0 25px;margin-top: 20px;border-top:1px solid gray;">
                <a href="<%=WEB_UI_URL%>register/" class="buttonLink">New to FirstVoices? Register here!</a>
                <a href="<%=WEB_UI_URL%>forgotpassword/" class="buttonLink">Forgot your password?</a>
			</div>
		</div>

	</div>

	<div style="color:#fff;font-weight:bold;background: 0 95% url(<%=WEB_UI_URL%>assets/images/footer-background.png) no-repeat;height:45px;padding-top: 15px;">
		Need help? Feel free to contact us at support@fpcc.ca
	</div>

		</div>



  </body>
</html>
