<html>
<body>
Hello ${userinfo.firstName} ${userinfo.lastName}, <br /><br/>
Thank you for creating an account on FirstVoices.com <#if documentTitle != ""> with <strong>${documentTitle}</strong> as your community portal.</#if><br/>
Please follow the instructions in this email to complete your registration.<br/><br/>

Your <strong>username</strong> is: ${userinfo.login} (case-sensitive)<br/>
Your <strong>password</strong> can be setup by following this link:<br/>
<a href="${info['enterPasswordUrl']}${configurationName}/${userinfo.id}">${info['enterPasswordUrl']}${configurationName}/${userinfo.id}</a><br/><br/>

<!--Once you create a password, you will be able to login by going to https://www.firstvoices.com - your first login may take up to a minute as important settings are being configured.<br/><br/>-->
<#if documentTitle != "">If you have an official role working on language revitalization as part of your community, your language administrator may need to upgrade your account before you can edit/add new entries.<br/><br/></#if>

Please feel free to contact us at support@fpcc.ca for assistance or if you have any issues.<br/><br/>

Regards,<br/>
The FirstVoices team

</body>
</html>


