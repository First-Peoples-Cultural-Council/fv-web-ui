<html>
<body>
Hello ${firstName} ${lastName} ${traditionalName}!<br /><br />
You registered for FirstVoices on ${dateCreated}.<br />

Please complete your registration as it is about to expire in a few days.<br />

Your <strong>username</strong> is: ${userinfo.login} (case-sensitive)<br />
Your <strong>password</strong> can be setup by following this link:<br />
<a href="${info['enterPasswordUrl']}">${info['enterPasswordUrl']}</a><br /><br />

<p>Please feel free to contact us at hello@firstvoices.com for assistance or if you have any issues.</p>

<p>Regards,<br />
    The FirstVoices Team</p>
</body>
</html>
