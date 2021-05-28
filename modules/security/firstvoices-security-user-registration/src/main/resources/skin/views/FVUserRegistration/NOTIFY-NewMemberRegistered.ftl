<html>
<body>
Hello!<br /><br />
${fName} ${lName} wants to join <strong>${dialect}</strong> on FirstVoices as a community member.<br />

<#if comment != "">
    <p>They included this comment: </p>
    <p>${comment}</p>
</#if>

<p>
    You can approve them as a community member here:<br />
    <a href="${appURL}/tasks/users/${dialectId}">${appURL}/tasks/users/${dialectId}</a> (Note: you must be logged in to
    perform that action)
</p>

<p>You can also connect with them directly here ${email} or choose to ignore this email.</p>

<p>Please do not reply to this email. Feel free to contact us at support@fpcc.ca for assistance or if you have any
    issues.</p>

<p>Regards,<br />
    The FirstVoices Team</p>
</body>
</html>
