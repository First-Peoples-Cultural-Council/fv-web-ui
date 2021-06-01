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



<html>
<body>

<p>A user is requesting access to a site you administer</p>

<dl>
    <dt>Dialect</dt>
    <dd>${dialectName}</dd>
    <dt>Email</dt>
    <dd>${username}</dd>
    <dt>First Name</dt>
    <dd>${firstName}</dd>
    <dt>Last Name</dt>
    <dd>${lastName}</dd>
    <dt>Traditional Name</dt>
    <dd>${traditionalName}</dd>
    <dt>Interest Reason</dt>
    <dd>${interestReason}</dd>
    <dt>Comment</dt>
    <dd>${comment}</dd>
    <dt>Language Team Member</dt>
    <dd>${languageTeam?string("Yes", "No")}</dd>
    <dt>Community Member</dt>
    <dd>${communityMember?string("Yes", "No")}</dd>
</dl>

<p>Regards,<br />
    The FirstVoices Team</p>
</body>
</html>
