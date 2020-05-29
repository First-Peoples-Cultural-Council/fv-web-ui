package ca.firstvoices.cognito;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.runtime.model.ComponentInstance;
import org.nuxeo.runtime.model.DefaultComponent;

public class AWSAwareUserManagerFactory extends DefaultComponent {

  private static Log LOG = LogFactory.getLog(AWSAwareUserManagerFactory.class);

  private AWSAwareUserManagerConfigurationDescriptor config;
  private AWSAwareUserManagerConfigurationService service;

  @Override
  public <T> T getAdapter(Class<T> adapter) {

    if (AWSAwareUserManagerConfigurationService.class.isAssignableFrom(adapter)) {
      if (this.service == null) {
        LOG.warn("AWSAwareUserManagerConfigurationService instance requested but we"
            + " are not configured");
      }
      return (T) this.service;
    }
    return null;
  }

  @Override
  public void registerContribution(Object contribution, String xp, ComponentInstance component) {

    if ("configuration".equals(xp)) {
      LOG.info("Configuration loaded: " + contribution.toString());

      this.config = (AWSAwareUserManagerConfigurationDescriptor) contribution;

      this.service = new AWSAwareUserManagerConfigurationService(this.config);

    }

    super.registerContribution(contribution, xp, component);
  }

  @Override
  public void unregisterContribution(Object contribution, String xp, ComponentInstance component) {
    if ("configuration".equals(xp)) {
      this.config = null;
      this.service = null;
    }
    super.unregisterContribution(contribution, xp, component);
  }


}
