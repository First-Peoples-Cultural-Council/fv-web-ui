<html>
<body>
Hello ${userinfo.firstName} ${userinfo.lastName}, <br /><br/>
Thank you for creating an account on FirstVoices.com <#if documentTitle != ""> with <strong>${documentTitle}</strong> as your community portal.</#if><br/>
<#if documentTitle != "" && info.dialect_current_status == "Enabled">
    <br/><strong>${documentTitle}</strong> is a private community portal, and so the language administrator will need to approve your request before you can access it. After you complete your registration below, an email will be sent to the language administrator for approval.<br/><br/>
<#else>
    <br/>Please set your password below to complete your registration.<br/><br/>
</#if>

Your <strong>username</strong> is: ${userinfo.login} (case-sensitive)<br/>
Your <strong>password</strong> can be setup by following this link:<br/>
<a href="${info['enterPasswordUrl']}${configurationName}/${userinfo.id}">${info['enterPasswordUrl']}${configurationName}/${userinfo.id}</a><br/><br/>

<#if documentTitle != "" && info.dialect_current_status != "Enabled">If you are part of the FirstVoices <strong>${documentTitle}</strong> team, your language administrator will need to upgrade your account before you can edit/add new entries.<br/><br/></#if>

Please feel free to contact us at support@fpcc.ca for assistance or if you have any issues.<br/><br/>

Regards,<br/>
The FirstVoices team

</body>
</html>


