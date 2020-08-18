package ca.firstvoices.simpleapi.nuxeo;

import java.util.logging.Logger;
import org.nuxeo.runtime.model.ComponentInstance;
import org.nuxeo.runtime.model.DefaultComponent;

public class SimpleAPINuxeoConfigurationFactory extends DefaultComponent {
  private static Logger log = Logger.getLogger(
      SimpleAPINuxeoConfigurationFactory.class.getCanonicalName()
  );


  private SimpleAPINuxeoConfiguration config;

  @Override
  public <T> T getAdapter(Class<T> adapter) {

    if (SimpleAPINuxeoConfiguration.class.isAssignableFrom(adapter)) {
      if (this.config == null) {
        log.warning("SimpleAPINuxeoConfigurationDescriptor instance requested but"
            + " we are not configured");
      }
      return (T) this.config;
    }
    return null;
  }

  @Override
  public void registerContribution(Object contribution, String xp, ComponentInstance component) {

    if ("configuration".equals(xp)) {
      log.info(() -> "Configuration loaded: " + contribution.toString());
      this.config = (SimpleAPINuxeoConfiguration) contribution;
    }

    super.registerContribution(contribution, xp, component);
  }

  @Override
  public void unregisterContribution(Object contribution, String xp, ComponentInstance component) {
    if ("configuration".equals(xp)) {
      this.config = null;
    }
    super.unregisterContribution(contribution, xp, component);
  }


}
