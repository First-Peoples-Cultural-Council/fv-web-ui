<!DOCTYPE html>
<!-- Nuxeo Enterprise Platform -->
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page language="java"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Locale"%>
<%@ page import="org.apache.commons.lang3.StringUtils"%>
<%@ page import="org.apache.commons.lang3.StringEscapeUtils"%>
<%@ page import="org.joda.time.DateTime"%>
<%@ page import="org.nuxeo.ecm.core.api.repository.RepositoryManager"%>
<%@ page import="org.nuxeo.ecm.platform.ui.web.auth.LoginScreenHelper"%>
<%@ page import="org.nuxeo.ecm.platform.web.common.MobileBannerHelper"%>
<%@ page import="org.nuxeo.ecm.platform.ui.web.auth.NXAuthConstants"%>
<%@ page import="org.nuxeo.ecm.platform.ui.web.auth.service.LoginProviderLink"%>
<%@ page import="org.nuxeo.ecm.platform.ui.web.auth.service.LoginScreenConfig"%>
<%@ page import="org.nuxeo.ecm.platform.web.common.admin.AdminStatusHelper"%>
<%@ page import="org.nuxeo.common.Environment"%>
<%@ page import="org.nuxeo.runtime.api.Framework"%>
<%@ page import="org.nuxeo.ecm.platform.ui.web.auth.service.LoginVideo" %>
<%@ page import="org.nuxeo.ecm.platform.web.common.locale.LocaleProvider"%>
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
String fvContext = Framework.getProperty("fv.contextPath");

HttpSession httpSession = request.getSession(false);
if (httpSession!=null && httpSession.getAttribute(NXAuthConstants.USERIDENT_KEY)!=null) {
  response.sendRedirect(context + "/" + LoginScreenHelper.getStartupPagePath());
}

Locale locale = request.getLocale();
String selectedLanguage = locale.getLanguage();
selectedLanguage = Framework.getLocalService(LocaleProvider.class).getLocaleWithDefault(selectedLanguage).getLanguage();

boolean maintenanceMode = AdminStatusHelper.isInstanceInMaintenanceMode();
String maintenanceMessage = AdminStatusHelper.getMaintenanceMessage();

LoginScreenConfig screenConfig = LoginScreenHelper.getConfig();
List<LoginProviderLink> providers = screenConfig.getProviders();
boolean useExternalProviders = providers!=null && providers.size()>0;

// fetch Login Screen config and manage default
boolean showNews = screenConfig.getDisplayNews();
String iframeUrl = screenConfig.getNewsIframeUrl();

String backgroundPath = LoginScreenHelper.getValueWithDefault(screenConfig.getBackgroundImage(), context + "/img/login_bg.jpg");
String bodyBackgroundStyle = LoginScreenHelper.getValueWithDefault(screenConfig.getBodyBackgroundStyle(), "url('" + backgroundPath + "') no-repeat center center fixed #006ead");
String loginButtonBackgroundColor = LoginScreenHelper.getValueWithDefault(screenConfig.getLoginButtonBackgroundColor(), "#0066ff");
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
String NUXEO_URL = VirtualHostHelper.getBaseURL(request);
boolean displayMobileBanner = !"false".equals(request.getParameter("displayMobileBanner"));

String urlWithContext =  fvContext.equals("") ? "" : ( NUXEO_URL + fvContext);
%>

<html>
<%
if (selectedLanguage != null) { %>
<fmt:setLocale value="<%= selectedLanguage %>"/>
<%
}%>
<fmt:setBundle basename="messages" var="messages"/>

<head>
<title><%=productName%></title>
<link rel="icon" type="image/png" href="<%=context%>/icons/favicon.png" />
<link rel="shortcut icon" type="image/x-icon" href="<%=context%>/icons/favicon.ico" />
<script type="text/javascript" src="<%=context%>/scripts/detect_timezone.js"></script>
<script type="text/javascript" src="<%=context%>/scripts/nxtimezone.js"></script>
<% if (displayMobileBanner) { %>
<script type="text/javascript" src="<%=context%>/scripts/mobile-banner.js"></script>
<% } %>
<script type="text/javascript">
  nxtz.resetTimeZoneCookieIfNotSet();
</script>

<meta name="viewport" content="width=device-width, initial-scale=1">

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

<body>
<% if (hasVideos && !isTesting) { %>
<video autoplay <%= muted + loop %> preload="auto" poster="<%=backgroundPath%>" id="bgvid">
  <% for (LoginVideo video : screenConfig.getVideos()) { %>
  <source src="<%= video.getSrc() %>" type="<%= video.getType() %>">
  <% } %>
</video>
<% } %>
<!-- Locale: <%= selectedLanguage %> -->
<div class="container-box"">
    <div class="main">
  <div data-component-id="AppBar" style="background-color:#b40000;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;box-sizing:border-box;font-family:Arial, sans-serif;-webkit-tap-highlight-color:rgba(0,0,0,0);box-shadow:0 1px 6px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.12);border-radius:0px;position:relative;z-index:1100;width:100%;display:flex;min-height:64px;padding-left:24px;padding-right:24px;" data-reactid=".0.0.1.0.0">
      <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0;padding-top:15px;letter-spacing:0;font-size:24px;font-weight:400;color:#ffffff;line-height:64px;box-flex:1;flex:1;" data-reactid=".0.0.1.0.0.1"><span class="hidden-xs" data-reactid=".0.0.1.0.0.1.0"><img src="<%=logoUrl%>" style="padding:0 0 5px 0;" alt="FirstVoices" data-reactid=".0.0.1.0.0.1.0.0"></span></div>
    </div>
      <div style="margin-bottom:15px;text-align:center;">
        <h1 style="font-weight:500;">Already a member? Log into FirstVoices</h1>

        <div>
      <form class="fv-form" method="post" action="startup" autocomplete="<%= fieldAutocomplete %>">
        <!-- To prevent caching -->
        <%
          response.setHeader("Cache-Control", "no-cache"); // HTTP 1.1
          response.setHeader("Pragma", "no-cache"); // HTTP 1.0
          response.setDateHeader("Expires", -1); // Prevents caching at the proxy server
        %>
        <!-- ;jsessionid=<%=request.getSession().getId()%> -->
        <% if (maintenanceMode) { %>
          <div class="maintenanceModeMessage">
            <div class="warnMessage">
              <fmt:message bundle="${messages}" key="label.maintenancemode.active" /><br/>
              <fmt:message bundle="${messages}" key="label.maintenancemode.adminLoginOnly" />
            </div>
            <div class="infoMessage">
              <fmt:message bundle="${messages}" key="label.maintenancemode.message" /> : <br/>
            </div>
          </div>
        <%} %>
        <c:if test="${param.nxtimeout}">
          <div class="feedbackMessage">
            <fmt:message bundle="${messages}" key="label.login.timeout" />
          </div>
        </c:if>
        <c:if test="${param.connectionFailed}">
          <div class="feedbackMessage errorMessage">
           <fmt:message bundle="${messages}" key="label.login.connectionFailed" />
          </div>
        </c:if>
        <c:if test="${param.loginFailed == 'true' and param.connectionFailed != 'true'}">
         <div class="feedbackMessage errorMessage">
           <fmt:message bundle="${messages}" key="label.login.invalidUsernameOrPassword" />
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
        <div>
          <input  onBlur="return validateUserNameForCommonIssues();" class="login_input type="text" name="user_name" id="username"
            placeholder="<fmt:message bundle="${messages}" key="label.login.username" />"/>
            <i class="icon-key"></i>
        </div>
        <div>
          <input class="login_input" type="password" name="user_password" id="password"
            placeholder="<fmt:message bundle="${messages}" key="label.login.password" />"/>
            <i class="icon-key"></i>
        </div>
        <% if (selectedLanguage != null) { %>
        <input type="hidden" name="language" id="language" value="<%= selectedLanguage %>" />
        <% } %>
        <input type="hidden" name="requestedUrl" id="requestedUrl" value="${fn:escapeXml(param.requestedUrl == "'<%= fvContext %>'/index.html"?"'<%= fvContext %>'":param.requestedUrl)}" />
        <input type="hidden" name="forceAnonymousLogin" id="true" />
        <input type="hidden" name="form_submitted_marker" id="form_submitted_marker" />
        <input class="login_button" type="submit" name="Submit"
          value="<fmt:message bundle="${messages}" key="label.login.logIn" />" />
        <% if (useExternalProviders) {%>
        <div class="loginOptions">
          <p><fmt:message bundle="${messages}" key="label.login.loginWithAnotherId" /></p>
          <div class="idList">
            <% for (LoginProviderLink provider : providers) { %>
            <div class="idItem">
              <a href="<%= provider.getLink(request, request.getContextPath() + request.getParameter("requestedUrl")) %>"
                style="background-image:url('<%=(context + provider.getIconPath())%>')" title="<%=provider.getDescription()%>"><%=provider.getLabel()%>
              </a>
            </div>
            <%}%>
          </div>
        </div>
        <%}%>
      </form>
     <div style="text-align: center;padding: 20px 0 0 25px;margin-top: 20px;border-top:1px solid gray;">
        <a href="<%=urlWithContext%>/register?requestedUrl=<%=fvContext%>/register" class="buttonLink">New to FirstVoices? Register here!</a>
        <a href="<%=urlWithContext%>/forgotpassword?requestedUrl=<%=fvContext%>/forgotpassword" class="buttonLink">Forgot your password?</a>
      </div>
    </div>
</div>
  <div style="color:#fff;font-weight:bold;background: 0 95% url(<%=NUXEO_URL%>/img/footer-background.png) no-repeat;height:45px;padding-top: 15px;">
    Need help? Feel free to contact us at support@fpcc.ca
  </div>

<!--   Current User = <%=request.getRemoteUser()%> -->

</body>
</html>
