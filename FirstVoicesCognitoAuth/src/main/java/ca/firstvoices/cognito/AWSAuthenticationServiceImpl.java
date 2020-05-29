package ca.firstvoices.cognito;

import ca.firstvoices.cognito.exceptions.MiscellaneousFailureException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.cognitoidp.model.AdminSetUserPasswordRequest;
import com.amazonaws.services.cognitoidp.model.AdminSetUserPasswordResult;
import com.amazonaws.services.cognitoidp.model.AuthFlowType;
import com.amazonaws.services.cognitoidp.model.DescribeUserPoolRequest;
import com.amazonaws.services.cognitoidp.model.InitiateAuthRequest;
import com.amazonaws.services.cognitoidp.model.InitiateAuthResult;
import com.amazonaws.services.cognitoidp.model.ListUsersRequest;
import com.amazonaws.services.cognitoidp.model.ListUsersResult;
import com.amazonaws.services.cognitoidp.model.NotAuthorizedException;
import java.util.HashMap;
import java.util.Map;
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


  public AWSAuthenticationServiceImpl(
      String accessKey,
      String secretKey,
      String userPool,
      String region,
      String clientID) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.userPool = userPool;
    this.region = region;
    this.clientID = clientID;

    this.identityProvider = AWSCognitoIdentityProviderClientBuilder
        .standard()
        .withRegion(region)
        .withCredentials(new AWSStaticCredentialsProvider(
            new BasicAWSCredentials(this.accessKey, this.secretKey)
        ))
        .build();
  }

  @Override
  public void testConnection() throws MiscellaneousFailureException {
    try {
      LOG.info("Testing connection to AWS Cognito by requesting user pool metadata");
      this.identityProvider.describeUserPool(
          new DescribeUserPoolRequest().withUserPoolId(userPool)
      );
      LOG.info("Success");
    } catch (Exception e) {
      LOG.error("AWS Cognito Connection failure, check params", e);
      throw new MiscellaneousFailureException(e);
    }
  }

  @Override
  public boolean userExists(String username) {
    ListUsersResult usersResult = this.identityProvider
        .listUsers(
            new ListUsersRequest()
                .withUserPoolId(userPool)
                .withLimit(1)
                .withFilter("username = \"" + username + "\"")
        );

    return usersResult.getUsers().size() != 0;
  }

  @Override
  public boolean authenticate(String username, String password)
      throws MiscellaneousFailureException {
    try {
      Map<String, String> authParams = new HashMap<>();
      authParams.put("USERNAME", username);
      authParams.put("PASSWORD", password);

      InitiateAuthRequest authRequest = new InitiateAuthRequest()
          .withAuthFlow(AuthFlowType.USER_PASSWORD_AUTH)
          .withClientId(this.clientID)
          .withAuthParameters(authParams);

      InitiateAuthResult initiateAuthResult = this.identityProvider.initiateAuth(authRequest);

      //@todo we can extend this code to handle unusual cases (like forced password resets)

      return true;
    } catch (NotAuthorizedException e) {
      LOG.warn("Password authentication failed for user " + username);
      return false;
    } catch (Exception e) {
      LOG.error("Caught an unexpected exception while authenticating", e);
      throw new MiscellaneousFailureException(e);
    }
  }

  @Override
  public void updatePassword(String username, String password)
      throws MiscellaneousFailureException {
    AdminSetUserPasswordRequest passwordRequest = new AdminSetUserPasswordRequest()
        .withUserPoolId(userPool)
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
