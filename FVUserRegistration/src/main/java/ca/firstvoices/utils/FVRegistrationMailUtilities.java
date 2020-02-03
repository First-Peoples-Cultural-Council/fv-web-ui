package ca.firstvoices.utils;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.features.PrincipalHelper;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.security.PermissionProvider;
import org.nuxeo.ecm.platform.rendering.api.RenderingException;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.user.invite.RenderingHelper;
import org.nuxeo.runtime.api.Framework;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.security.auth.login.LoginException;
import java.io.StringWriter;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import static ca.firstvoices.utils.FVRegistrationConstants.*;

public class FVRegistrationMailUtilities {

    private static final Log log = LogFactory.getLog(FVRegistrationMailUtilities.class);

    private String getJavaMailJndiName() {
        return Framework.getProperty("jndi.java.mail", "java:/Mail");
    }

    /**
     * @param destination
     * @param copy
     * @param title
     * @param content
     * @throws Exception
     */
    private void generateMail(String destination, String copy, String title, String content, String BCC) throws Exception {

        InitialContext ic = new InitialContext();
        Session session = (Session) ic.lookup(getJavaMailJndiName());

        MimeMessage msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(session.getProperty("mail.from")));
        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(destination, false));

        if (!StringUtils.isBlank(copy)) {
            msg.addRecipient(Message.RecipientType.CC, new InternetAddress(copy, false));
        }

        if (!StringUtils.isBlank(BCC)) {
            msg.addRecipient(Message.RecipientType.BCC, new InternetAddress(BCC, false));
        }

        msg.setSubject(title, "UTF-8");
        msg.setSentDate(new Date());
        msg.setContent(content, "text/html; charset=utf-8");

        Transport.send(msg);
    }

    private static boolean isValidEmailAddress(String email) {
        boolean result = true;
        try {
            InternetAddress emailAddr = new InternetAddress(email);
            emailAddr.validate();
        } catch (AddressException ex) {
            result = false;
        }
        return result;
    }

    private String composeEmailString(Set<String> emailSet) {
        String toStr = new String();

        for (String em : emailSet) {
            if (!isValidEmailAddress(em))
                continue;

            if (toStr.isEmpty()) {
                toStr = em;
            } else {
                toStr = toStr + ", " + em;
            }
        }

        return toStr;
    }

    /**
     * @param dialect
     * @return
     */
    public String getLanguageAdministratorEmail(DocumentModel dialect) throws LoginException {
        UserManager umgr = Framework.getService(UserManager.class);
        PermissionProvider permissionProvider = Framework.getService(PermissionProvider.class);

        PrincipalHelper ph = new PrincipalHelper(umgr, permissionProvider);
        Set<String> result = ph.getEmailsForPermission(dialect, "Everything", false);
        Set<String> super_admins = ph.getEmailsFromGroup(umgr.getAdministratorsGroups().get(0),false);

        // Remove super admins from list of emails
        result.removeAll(super_admins);

        return composeEmailString(result);
    }

    /**
     * @return
     */
    public String getSuperAdministratorEmail() throws LoginException {
        UserManager umgr = Framework.getService(UserManager.class);
        PermissionProvider permissionProvider = Framework.getService(PermissionProvider.class);

        PrincipalHelper ph = new PrincipalHelper(umgr, permissionProvider);
        Set<String> super_admins = ph.getEmailsFromGroup(umgr.getAdministratorsGroups().get(0),false);

        return composeEmailString(super_admins);
    }

    private interface EmailContentAssembler {
        String getEmailTitle(int variant, Map<String, String> options);

        String getEmailBody(int variant, Map<String, String> options);
    }

    private class AdminMailContent implements EmailContentAssembler {
        @Override
        public String getEmailTitle(int variant, Map<String, String> options) {
            String title = null;

            switch (variant) {
            case MID_REGISTRATION_PERIOD_ACT:
                title = "FirstVoices: User registration will expire soon.";
                break;
            case REGISTRATION_EXPIRATION_ACT:
                title = "FirstVoices: User registration was not completed and will be deleted.";
                break;
            case NEW_USER_SELF_REGISTRATION_ACT:
                title = "FirstVoices: New User Registration (action may be required)";
                break;
            case NEW_MEMBER_SELF_REGISTRATION_ACT:
                title = options.get("fName") + " wants to join " + options.get("dialect") + " on FirstVoices";
                break;
            case NEW_TEAM_MEMBER_SELF_REGISTRATION_ACT:
                title = options.get("fName") + " wants to join the " + options.get("dialect") + " language team on FirstVoices";
                break;
            }

            return title;
        }

        @Override
        public String getEmailBody(int variant, Map<String, String> options) {
            String bodyTemplate = null;

            switch (variant) {
            case MID_REGISTRATION_PERIOD_ACT:
                bodyTemplate = "skin/views/FVUserRegistration/NOTIFY-RegisterationAboutToExpire.ftl";
                break;
            case REGISTRATION_EXPIRATION_ACT:
                bodyTemplate = "skin/views/FVUserRegistration/NOTIFY-RegisterationExpired.ftl";
                break;
            case NEW_USER_SELF_REGISTRATION_ACT:
                bodyTemplate = "skin/views/FVUserRegistration/NOTIFY-NewUserRegistered.ftl";
                break;
            case NEW_MEMBER_SELF_REGISTRATION_ACT:
                bodyTemplate = "skin/views/FVUserRegistration/NOTIFY-NewMemberRegistered.ftl";
                break;
            case NEW_TEAM_MEMBER_SELF_REGISTRATION_ACT:
                bodyTemplate = "skin/views/FVUserRegistration/NOTIFY-NewTeamMemberRegistered.ftl";
                break;
            }

            StringWriter writer = new StringWriter();
            RenderingHelper rh = new RenderingHelper();

            // Add site url to options
            String siteURL = Framework.getProperty("nuxeo.url");
            String fvContextPath = Framework.getProperty("fv.contextPath");
            String baseRequest = siteURL;
            if (baseRequest.endsWith("/nuxeo")) {
                baseRequest = baseRequest.substring(0, baseRequest.indexOf("/nuxeo"));
            }
            options.put("appURL", baseRequest + (StringUtils.isEmpty(fvContextPath) ? "" : ("/" + fvContextPath)));
            options.put("siteURL", siteURL);

            try {
                rh.getRenderingEngine().render(bodyTemplate, options, writer);
            } catch (RenderingException e) {
                throw new NuxeoException("Error during rendering email", e);
            }

            return writer.getBuffer().toString();
        }
    }

    private class UserReminderMailContent implements EmailContentAssembler {
        @Override
        public String getEmailTitle(int variant, Map<String, String> options) {
            String title = null;

            switch (variant) {
            case MID_REGISTRATION_PERIOD_ACT:
                title = "NOTIFICATION Your registration will expire soon.";
                break;
            case REGISTRATION_EXPIRATION_ACT:
                title = "NOTIFICATION Your registration was not completed and will be deleted.";
                break;
            case REGISTRATION_DELETION_ACT:
                title = "Your registration to FirstVoices was deleted.";
                break;
            default:
            }
            return title;
        }

        @Override
        public String getEmailBody(int variant, Map<String, String> options) {
            String body = null;
            String g = "Dear " + options.get("fName") + ",";
            String e3 = "<br> Your registration to FirstVoices will expire in 3 days.";
            String e24 = "<br> Your registration to FirstVoices expired and will be deleted in 24 hrs.";
            String del = "<br> Your registration to FirstVoices was deleted.";
            String ln = "<br><br> Your login name is: " + options.get("email");
            String dp = "<br><br> You registered to participate in " + options.get("dialect") + ". <br>";
            String endStr = "<br> Please setup account password to complete registration.";
            String re = "<br> In order to participate in FirstVoices you will need to register again.";
            String endStr_D = "<br><br> If you do so please complete registration by setting up your account password.";
            String thankYou = " <br><br> Regards,<br> The FirstVoices team";

            switch (variant) {
            case MID_REGISTRATION_PERIOD_ACT:
                body = g + e3 + ln + dp + endStr + thankYou;
                break;
            case REGISTRATION_EXPIRATION_ACT:
                body = g + e24 + ln + dp + endStr + thankYou;
                break;
            case REGISTRATION_DELETION_ACT:
                body = g + del + re + endStr_D + thankYou;
                break;
            default:
            }

            return body;
        }
    }

    /**
     * @param variant
     * @param prep
     * @param options
     * @param toStr
     * @throws Exception
     */
    private void registrationMailSender(int variant, EmailContentAssembler prep, Map<String, String> options,
            String toStr, String BCC) throws Exception {
        String title = prep.getEmailTitle(variant, options);
        String body = prep.getEmailBody(variant, options);

        try {
            if (title != null && body != null) {
                if (!toStr.isEmpty()) {

                    // IF BCC equals toStr - a language admin does not exist
                    // Remove BCC, and mention something in the title
                    if (BCC.equals(toStr)) {
                        BCC = "";
                        title = "[NO-ADMIN] " + title;
                    }

                    generateMail(toStr, "", title, body, BCC);
                } else {
                    generateMail(options.get("email"), "", title, body, BCC);
                }
            }
        } catch (NamingException | MessagingException e) {
            log.warn(e);
            throw new NuxeoException("Error while sending mail", e);
        }
    }

    /**
     * @param variant
     * @param options
     * @param toStr
     * @throws Exception
     */
    public void registrationAdminMailSender(int variant, Map<String, String> options, String toStr, String BCC) throws Exception {
        registrationMailSender(variant, new AdminMailContent(), options, toStr, BCC);
    }

    /**
     * @param variant
     * @param registrationRequest
     * @param session
     * @throws Exception
     */
    public void emailReminder(int variant, DocumentModel registrationRequest, CoreSession session) throws Exception {
        String requestedSpaceId = (String) registrationRequest.getPropertyValue("docinfo:documentId");

        // Source lookup (unrestricted)
        FVRegistrationUtilities.UnrestrictedSourceDocumentResolver usdr = new FVRegistrationUtilities.UnrestrictedSourceDocumentResolver(
                session, requestedSpaceId);
        usdr.runUnrestricted();

        // Source document
        DocumentModel dialect = usdr.dialect;
        String dialectTitle = (String) dialect.getPropertyValue("dc:title");

        Map<String, String> options = new HashMap<>();
        options.put("fName", (String) registrationRequest.getPropertyValue("userinfo:firstName"));
        options.put("lName", (String) registrationRequest.getPropertyValue("userinfo:lastName"));
        options.put("email", (String) registrationRequest.getPropertyValue("userinfo:email"));
        options.put("comment", (String) registrationRequest.getPropertyValue("fvuserinfo:comment"));
        options.put("dialect", dialectTitle);

        registrationMailSender(variant, new UserReminderMailContent(), options, "", "");

        // TODO Decide if we need to send reminders to admins
        // String toStr = getLanguageAdministratorEmail(dialect);
        // registrationMailSender( variant, new AdminMailContent(), options , toStr );
    }
}
