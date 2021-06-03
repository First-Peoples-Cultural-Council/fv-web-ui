<html>
    <body>

    Hello!<br /><br />
    ${traditionalName} ${firstName} ${lastName} wants to join <strong>${siteName}</strong> on FirstVoices as a community member.<br /><br />
    <p>
        ${interestReasons.${interestReason}}
        <strong>Comment</strong>: &quot;${comment!"Not Provided"}&quot;<br/><br/>
        <strong>Interest Reason</strong>: ${interestReason?switch('teacher', 'I am a teacher/educator', 'student' 'I am a learner/student', 'learner-1', 'I am interested in learning MY language', 'learner-2', 'I am interested in learning A language', 'other', 'Other')!"Not Provided"}<br/><br/>
        <strong>Community Member</strong>: ${communityMember?string("Yes", "No")}<br/><br/>
        <strong>Language Team Member</strong>: ${languageTeam?string("Yes", "No")}
    </p>

    <p>
        What next?<br/>
        <ul>
            <li>You can <strong>approve</strong> or <strong>ignore</strong> their request <a href="${siteURL}/nuxeo/login.jsp?requestedUrl=../dashboard/membership">on your dashboard</a></li>
            <li>You can also connect with them directly via email ${email}.</li>
        </ul>
    </p>

    <p>Feel free to contact us at hello@firstvoices.com for assistance or if you have any issues.</p>

    <p>Regards,<br />
        The FirstVoices Team</p>
</body>
</html>