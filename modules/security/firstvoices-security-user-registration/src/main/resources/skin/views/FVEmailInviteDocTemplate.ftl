<html>
<body>
Hello ${userinfo.firstName} ${userinfo.lastName}, <br />

<#if documentTitle != "">
    <p>You have been added as a user on FirstVoices.<br/>
        Your default community portal has been set to <strong>${documentTitle}</strong>.</p>
</#if>

<#if comment != "">
<br/>
<p>Message from the sender: </p>
<p>${comment}</p>
</#if>

<p>Your username is: ${userinfo.login} (case-sensitive)<br/>
<#if !userAlreadyExists>
Your password can be defined by <a href="${info['enterPasswordUrl']}${configurationName}/${userinfo.id}">validating your invitation here</a>.
</#if>
<#if userAlreadyExists>
Your password which was selected during registration.<br/>
You can validate your invitation through this <a href="${info['enterPasswordUrl']}${configurationName}/${userinfo.id}">link</a>.
</#if>
</p>

<p>In order to login, please go to https://www.firstvoices.com and use the SIGN IN option.<br/>
Your first login may take up to a minute as important settings are being setup.</p>

<p>Regards,<br/>
The FirstVoices Team</p>
</body>
</html>