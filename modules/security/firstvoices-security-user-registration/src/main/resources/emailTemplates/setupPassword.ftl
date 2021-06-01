<!-- This email template is sent to new users who register for FirstVoices -->
<html>
<body>
Hello ${userinfo.firstName} ${userinfo.lastName}, <br /><br />
Thank you for creating an account on FirstVoices.com<br />
Please follow the instructions in this email to complete your registration.<br /><br />

Your <strong>username</strong> is: ${userinfo.login} (case-sensitive)<br />
Your <strong>password</strong> can be setup by following this link:<br />
<a href="${info['enterPasswordUrl']}${configurationName}/${userinfo.id}">${info['enterPasswordUrl']}${configurationName}/${userinfo.id}</a><br /><br />

Please feel free to contact us at hello@firstvoices.com for assistance or if you have any issues.<br /><br />

Regards,<br />
The FirstVoices team

</body>
</html>


