package ca.firstvoices.cognito;

import ca.firstvoices.cognito.exceptions.InvalidMigrationException;
import ca.firstvoices.cognito.exceptions.MiscellaneousFailureException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.cognitoidp.model.AdminCreateUserRequest;
import com.amazonaws.services.cognitoidp.model.AdminSetUserPasswordRequest;
import com.amazonaws.services.cognitoidp.model.AttributeType;
import com.amazonaws.services.cognitoidp.model.AuthFlowType;
import com.amazonaws.services.cognitoidp.model.DescribeUserPoolRequest;
import com.amazonaws.services.cognitoidp.model.DescribeUserPoolResult;
import com.amazonaws.services.cognitoidp.model.InitiateAuthRequest;
import com.amazonaws.services.cognitoidp.model.InitiateAuthResult;
import com.amazonaws.services.cognitoidp.model.ListUsersRequest;
import com.amazonaws.services.cognitoidp.model.ListUsersResult;
import com.amazonaws.services.cognitoidp.model.NotAuthorizedException;
import com.amazonaws.services.cognitoidp.model.PasswordPolicyType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


public class AWSAuthenticationServiceImpl implements AWSAuthenticationService {

  private static Log LOG = LogFactory.getLog(AWSAuthenticationService.class);


  private String accessKey;
  private String secretKey;
  private String userPool;
  private String region;
  private String clientID;

  private AWSCognitoIdentityProvider identityProvider;
  private AWSPasswordValidator passwordValidator;


  public AWSAuthenticationServiceImpl(String accessKey,
                                      String secretKey,
                                      String userPool,
                                      String region,
                                      String clientID) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.userPool = userPool;
    this.region = region;
    this.clientID = clientID;

    this.identityProvider = AWSCognitoIdentityProviderClientBuilder.standard()
        .withRegion(region)
        .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(this.accessKey,
            this.secretKey)))
        .build();
  }

  private static boolean validateEmailAddress(String email) {
    //could also use commons validation here rather than builtin
    try {
      InternetAddress ia = new InternetAddress(email);
      ia.validate();
    } catch (AddressException e) {
      return false;
    }
    return true;
  }

  @Override public void testConnection() throws MiscellaneousFailureException {
    try {
      LOG.info("Testing connection to AWS Cognito by requesting user pool metadata");
      DescribeUserPoolResult result =
          this.identityProvider.describeUserPool(new DescribeUserPoolRequest().withUserPoolId(
              userPool));
      PasswordPolicyType passwordPolicy = result.getUserPool().getPolicies().getPasswordPolicy();
      this.passwordValidator = new AWSPasswordValidator(passwordPolicy);

      LOG.info("Success");
    } catch (Exception e) {
      LOG.error("AWS Cognito Connection failure, check params", e);
      throw new MiscellaneousFailureException(e);
    }
  }

  @Override public boolean userExists(String username) {
    ListUsersResult usersResult =
        this.identityProvider.listUsers(new ListUsersRequest().withUserPoolId(userPool)
            .withLimit(1)
            .withFilter("username = \"" + username + "\""));

    return usersResult.getUsers().size() != 0;
  }

  @Override public boolean authenticate(String username, String password)
      throws MiscellaneousFailureException {
    try {
      Map<String, String> authParams = new HashMap<>();
      authParams.put("USERNAME", username);
      authParams.put("PASSWORD", password);

      InitiateAuthRequest authRequest =
          new InitiateAuthRequest().withAuthFlow(AuthFlowType.USER_PASSWORD_AUTH)
              .withClientId(this.clientID)
              .withAuthParameters(authParams);

      InitiateAuthResult initiateAuthResult = this.identityProvider.initiateAuth(authRequest);

      //@todo we can extend this code to handle unusual cases (like forced password resets)

      return true;
    } catch (NotAuthorizedException e) {
      LOG.warn("[AWS Cognito] Password authentication failed for user " + username);
      return false;
    } catch (Exception e) {
      LOG.error("[AWS Cognito] Caught an unexpected exception while authenticating", e);
      throw new MiscellaneousFailureException(e);
    }
  }

  @Override public void updatePassword(String username, String password)
      throws MiscellaneousFailureException {
    if (password != null && userExists(username)) {

      AdminSetUserPasswordRequest passwordRequest =
          new AdminSetUserPasswordRequest().withUserPoolId(userPool)
              .withPermanent(true)
              .withUsername(username)
              .withPassword(password);

      try {
        this.identityProvider.adminSetUserPassword(passwordRequest);
      } catch (AmazonServiceException e) {
        LOG.error("Caught an unexpected exception while updating password", e);
        throw new MiscellaneousFailureException(e);
      }
    }
  }

  @Override public void migrateUser(String username, String password, String email)
      throws MiscellaneousFailureException, InvalidMigrationException {


    if (!validateEmailAddress(email)) {
      throw new InvalidMigrationException(String.format(
          "Username %s has no valid email address (have %s) " + "and will not be migrated",
          username,
          email));
    }

    if (!validateEmailAddress(username)) {
      throw new InvalidMigrationException(String.format(
          "Username %s is not an email and will not be migrated",
          username));
    }

    if (this.passwordValidator == null) {
      this.testConnection();
    }

    if (!this.passwordValidator.validatePassword(password)) {
      throw new InvalidMigrationException(String.format(
          "Username %s has password failing complexity requirements." + " Will not migrate.",
          username));
    }

    AdminCreateUserRequest request = new AdminCreateUserRequest();
    request.setUserPoolId(this.userPool);
    request.setUsername(username);
    request.setMessageAction("SUPPRESS");
    request.setTemporaryPassword(password);


    List<AttributeType> userAttributes = new ArrayList<>();
    userAttributes.add(new AttributeType().withName("email_verified").withValue("true"));
    userAttributes.add(new AttributeType().withName("email").withValue(email));
    request.setUserAttributes(userAttributes);

    try {
      this.identityProvider.adminCreateUser(request);

      //mark the password as permanent
      AdminSetUserPasswordRequest passwordRequest =
          new AdminSetUserPasswordRequest().withUserPoolId(this.userPool)
              .withPermanent(true)
              .withUsername(username)
              .withPassword(password);

      this.identityProvider.adminSetUserPassword(passwordRequest);

    } catch (AmazonServiceException e) {
      LOG.error("Unexpected exception while migrating user", e);
      throw new MiscellaneousFailureException(e);
    }
  }
}
