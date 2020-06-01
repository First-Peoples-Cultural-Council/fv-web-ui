package ca.firstvoices.cognito;

import org.nuxeo.common.xmap.annotation.XNode;
import org.nuxeo.common.xmap.annotation.XObject;

public class AWSAwareUserManagerConfigurationService {

  private AWSAwareUserManagerConfigurationDescriptor config;

  public AWSAwareUserManagerConfigurationService(AWSAwareUserManagerConfigurationDescriptor conf) {
    this.config = conf;
  }

  public AWSAwareUserManagerConfigurationDescriptor getConfig() {
    return config;
  }
}
