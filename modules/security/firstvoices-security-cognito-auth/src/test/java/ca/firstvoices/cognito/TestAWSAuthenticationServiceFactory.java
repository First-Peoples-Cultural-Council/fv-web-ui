package ca.firstvoices.cognito;


import ca.firstvoices.cognito.exceptions.MiscellaneousFailureException;
import java.util.Arrays;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.runtime.model.ComponentInstance;
import org.nuxeo.runtime.model.DefaultComponent;


/**
 * This is a duplication of the implementation from the source tree, but returns a mock
 * AWSAuthenticationService, so as to avoid making real calls against AWS during testing.
 */
public class TestAWSAuthenticationServiceFactory extends DefaultComponent {
  private static Log LOG = LogFactory.getLog(TestAWSAuthenticationServiceFactory.class);


  private AWSAuthenticationServiceConfigurationDescriptor config;
  private AWSAuthenticationService authenticationService;

  @Override
  public <T> T getAdapter(Class<T> adapter) {

    if (AWSAuthenticationService.class.isAssignableFrom(adapter)) {
      if (this.authenticationService == null) {
        LOG.warn("AWSAuthenticationService instance requested but we are not configured");
      }
      return (T) this.authenticationService;
    }
    return null;
  }

  @Override
  public void registerContribution(Object contribution, String xp, ComponentInstance component) {

    if ("configuration".equals(xp)) {
      LOG.info("Configuration loaded: " + contribution.toString());

      this.config = (AWSAuthenticationServiceConfigurationDescriptor) contribution;

      this.authenticationService = new TestAWSAuthenticationServiceImpl(
      );

      try {
        this.authenticationService.testConnection();
      } catch (MiscellaneousFailureException e) {
        LOG.warn("AWS Cognito connection problem.", e);
      }
    }

    super.registerContribution(contribution, xp, component);
  }

  @Override
  public void unregisterContribution(Object contribution, String xp, ComponentInstance component) {
    if ("configuration".equals(xp)) {
      this.config = null;
      this.authenticationService = null;
    }
    super.unregisterContribution(contribution, xp, component);
  }

  public static class TestAWSAuthenticationServiceImpl implements AWSAuthenticationService {
    public static final List<String> DUMMY_USERS = Arrays.asList(
        "test_aws_user_1",
        "test_aws_user_2"
    );

    @Override
    public void testConnection() throws MiscellaneousFailureException {

    }

    @Override
    public boolean userExists(String username) {
      return DUMMY_USERS.contains(username);
    }

    @Override
    public boolean authenticate(String username, String password)
        throws MiscellaneousFailureException {
      return this.userExists(username);
    }

    @Override
    public void updatePassword(String username, String password)
        throws MiscellaneousFailureException {
    }

    @Override
    public void migrateUser(String username, String password, String email)
        throws MiscellaneousFailureException {

    }
  }
}
