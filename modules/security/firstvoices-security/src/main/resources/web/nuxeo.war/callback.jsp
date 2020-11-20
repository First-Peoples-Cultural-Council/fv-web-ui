<%
    String code = request.getParameter("code");
    String state = request.getParameter("state");

    response.sendRedirect("/nuxeo/nxstartup.faces?"
            + "provider=CognitoOpenIDConnect&forceAnonymousLogin=true"
            + "&code=" + code + (state != null ? ("&state=" + state) : ""));
%>
