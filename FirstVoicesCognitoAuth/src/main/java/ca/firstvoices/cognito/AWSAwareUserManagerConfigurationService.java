package ca.firstvoices.cognito;

public class AWSAwareUserManagerConfigurationService {

  private AWSAwareUserManagerConfigurationDescriptor config;

  public AWSAwareUserManagerConfigurationService(AWSAwareUserManagerConfigurationDescriptor conf) {
    this.config = conf;
  }

  public AWSAwareUserManagerConfigurationDescriptor getConfig() {
    return config;
  }
}
