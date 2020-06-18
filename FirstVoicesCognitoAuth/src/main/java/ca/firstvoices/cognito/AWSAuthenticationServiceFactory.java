package ca.firstvoices.cognito;

import ca.firstvoices.cognito.exceptions.MiscellaneousFailureException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.runtime.model.ComponentInstance;
import org.nuxeo.runtime.model.DefaultComponent;

public class AWSAuthenticationServiceFactory extends DefaultComponent {
  private static Log LOG = LogFactory.getLog(AWSAuthenticationServiceFactory.class);


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

      this.authenticationService = new AWSAuthenticationServiceImpl(
          this.config.accessKey,
          this.config.secretKey,
          this.config.userPool,
          this.config.region,
          this.config.clientID
      );
      try {
        this.authenticationService.testConnection();
      } catch (MiscellaneousFailureException e) {
        LOG.warn("An exception occurred while testing the connection. AWS Cognito authentication"
            + " will not work", e);
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


}
