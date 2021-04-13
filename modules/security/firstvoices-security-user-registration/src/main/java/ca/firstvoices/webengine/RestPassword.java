/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package ca.firstvoices.webengine;

import ca.firstvoices.resetpassword.runner.CreatePasswordResetLinkUnrestricted;
import ca.firstvoices.resetpassword.runner.SearchRegistrationByResetPassKeyUnrestricted;
import ca.firstvoices.resetpassword.runner.SetNewPasswordUnrestricted;
import ca.firstvoices.resetpassword.runner.StringHashGenerator;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage.RecipientType;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.mail.Composer;
import org.nuxeo.ecm.automation.core.mail.Mailer;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.webengine.forms.FormData;
import org.nuxeo.ecm.webengine.model.Template;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.ModuleRoot;
import org.nuxeo.runtime.api.Framework;

/**
 * This module provides access to resetPassword urls.
 */
@Path("/resetPassword")
@Produces("text/html;charset=UTF-8")
@WebObject(type = "RestPassword")
public class RestPassword extends ModuleRoot {

  public static final Log log = LogFactory.getLog(RestPassword.class);
  private static final String MAIL_FROM = Framework.getProperty("mail.from");
  public static String defaultRepositoryName;

  @GET
  public Object doGet() {
    Map<String, String> data = new HashMap<String, String>();
    return getView("newPasswordRequest").arg("data", data);
  }

  @POST
  @Path("sendPasswordMail")
  @Produces("text/html")
  public Object sendPasswordMail() throws NuxeoException {
    FormData formData = getContext().getForm();
    String email = formData.getString("EmailAddress");
    if (email == null || "".equals(email.trim())) {
      return redisplayFormWithErrorMessage("newPasswordRequest",
          ctx.getMessage("label.registerForm.validation.email"), formData);
    }
    email = email.trim();
    CreatePasswordResetLinkUnrestricted runner = new CreatePasswordResetLinkUnrestricted(
        getDefaultRepositoryName(), email);
    runner.runUnrestricted();

    String errorMessage = runner.getErrorMessage();
    if (errorMessage != null) {
      return redisplayFormWithErrorMessage("newPasswordRequest", ctx.getMessage(errorMessage),
          formData);
    } else {
      String passwordResetLink = runner.getPasswordResetLink();

      Template template = getView("mail/passwordForgotten");
      String subject = "FirstVoices - Your new password";
      String message = template.arg("passwordResetLink", passwordResetLink).render();
      try {
        sendEmail(email, subject, message);
      } catch (MessagingException e) {
        // issue while sending the mail
        log.error("Sending Registration E-Mail Error", e);
        return Response.status(500).build();
      }
      return redisplayFormWithInfoMessage("newPasswordRequest",
          ctx.getMessage("label.sendPasswordMail.emailSent"), formData);
    }
  }

  @GET
  @Path("enterNewPassword/{key}")
  @Produces("text/html")
  public Object enterNewPassword(@PathParam("key") String key) {
    SearchRegistrationByResetPassKeyUnrestricted runner =
        new SearchRegistrationByResetPassKeyUnrestricted(
        getDefaultRepositoryName(), key);
    runner.runUnrestricted();

    if (!StringHashGenerator.validateKey(key)) {
      return getView("wrongResetKey");
    }

    String errorMessage = runner.getErrorMessage();
    if (errorMessage != null) {
      return getView("wrongResetKey");
    } else {
      Map<String, String> data = new HashMap<String, String>();
      return getView("submitNewPassword").arg("key", key).arg("data", data);
    }
  }

  @POST
  @Path("submitNewPassword")
  @Produces("text/html")
  public Object submitNewPassword() throws URISyntaxException {
    FormData formData = getContext().getForm();
    String password = formData.getString("Password");
    String passwordConfirmation = formData.getString("PasswordConfirmation");
    if (password == null || "".equals(password.trim())) {
      return redisplayFormWithErrorMessage("submitNewPassword",
          ctx.getMessage("label.registerForm.validation.password"), formData);
    }
    if (passwordConfirmation == null || "".equals(passwordConfirmation.trim())) {
      return redisplayFormWithErrorMessage("submitNewPassword",
          ctx.getMessage("label.registerForm.validation.passwordconfirmation"), formData);
    }
    password = password.trim();
    passwordConfirmation = passwordConfirmation.trim();
    if (!password.equals(passwordConfirmation)) {
      return redisplayFormWithErrorMessage("submitNewPassword",
          ctx.getMessage("label.registerForm.validation.passwordvalidation"), formData);
    }

    String passwordKey = formData.getString("PasswordKey");

    SetNewPasswordUnrestricted runner = new SetNewPasswordUnrestricted(getDefaultRepositoryName(),
        password, passwordKey);
    runner.runUnrestricted();
    Response response = runner.getResponse();
    if (response != null) {
      return response;
    }
    String errorMessage = runner.getErrorMessage();
    if (errorMessage != null) {
      return redisplayFormWithErrorMessage("submitNewPassword", ctx.getMessage(errorMessage),
          formData).arg("key", passwordKey);
    } else {
      return redisplayFormWithInfoMessage("submitNewPassword",
          ctx.getMessage("label.submitNewPassword.saved"), formData).arg("key", passwordKey);
    }
  }

  protected Template redisplayFormWithMessage(String messageType, String formName, String message,
      FormData data) {
    Map<String, String> savedData = new HashMap<String, String>();
    for (String key : data.getKeys()) {
      savedData.put(key, data.getString(key));
    }
    return getView(formName).arg("data", savedData).arg(messageType, message);
  }

  protected Template redisplayFormWithInfoMessage(String formName, String message, FormData data) {
    return redisplayFormWithMessage("info", formName, message, data);
  }

  protected Template redisplayFormWithErrorMessage(String formName, String message, FormData data) {
    return redisplayFormWithMessage("err", formName, message, data);
  }

  public void sendEmail(String email, String subject, String message) throws MessagingException {
    Composer cp = new Composer();
    Mailer mailer = cp.getMailer();
    Mailer.Message msg = mailer.newMessage();
    msg.setFrom(MAIL_FROM);
    msg.setSubject(subject);
    msg.setRecipient(RecipientType.TO, new InternetAddress(email));
    msg.setContent(message, "text/html");
    msg.send();
  }

  private String getDefaultRepositoryName() {
    if (defaultRepositoryName == null) {
      try {
        defaultRepositoryName = Framework.getService(RepositoryManager.class).getDefaultRepository()
            .getName();
      } catch (Exception e) {
        throw new RuntimeException(e);
      }
    }
    return defaultRepositoryName;
  }
}
