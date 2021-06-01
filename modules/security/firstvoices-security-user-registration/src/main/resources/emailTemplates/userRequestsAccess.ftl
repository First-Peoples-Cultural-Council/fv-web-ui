<html>
    <body>

    Hello!<br /><br />
    ${traditionalName} ${firstName} ${lastName} wants to join <strong>${dialect}</strong> on FirstVoices as a community member.<br /><br />

    Additional details from them:
    <dl>
        <#if comment != "">
            <dt><strong>Comment</strong></dt>
            <dd>${comment}</dd>
        </#if>
        <#if interestReason != "">
            <dt><strong>Interest Reason</strong></dt>
            <dd>${interestReason}</dd>
        </#if>
        <dt><strong>Community Member</strong></dt>
        <dd>${communityMember?string("Yes", "No")}</dd>
        <dt><strong>Language Team Member</strong></dt>
        <dd>${languageTeam?string("Yes", "No")}</dd>
    </dl>

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