<html>
<body>
Hello!<br /><br />
    ${fName} ${lName} wants to join your <strong><strong>${dialect}</strong> language team</strong> on FirstVoices.<br />

<#if comment != "">
    <p>They included this comment: </p>
    <p>${comment}</p>
</#if>

<p>
    If you are expecting this registration, you may want to promote them to an active role by going here:<br/>
    <a href="${appURL}/tasks/users/${dialectId}">${appURL}/tasks/users/${dialectId}</a> (Note: you must be logged in to perform that action)
</p>

<p>You can also connect with them directly here ${email} or choose to ignore this email.</p>

<p>Please do not reply to this email. Feel free to contact us at support@fpcc.ca for assistance or if you have any issues.</p>

<p>Regards,<br/>
The FirstVoices Team</p>
</body>
</html>